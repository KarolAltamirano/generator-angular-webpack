'use strict';

/**
 *
 *      gulp build        - build for development
 *      gulp watch        - build and watch files for change
 *      gulp              - default task [watch]
 *      gulp build --dist - build for production
 *      gulp connect      - create http server for testing production version
 *      gulp bump --major - bump major version
 *      gulp bump --minor - bump minor version
 *      gulp bump --patch - bump patch version
 *
 */

var del           = require('del'),
    gulp          = require('gulp'),
    gutil         = require('gulp-util'),
    concat        = require('gulp-concat'),
    connect       = require('gulp-connect'),
    modRewrite    = require('connect-modrewrite'),
    uglify        = require('gulp-uglify'),
    sass          = require('gulp-sass'),
    postcss       = require('gulp-postcss'),
    assets        = require('postcss-assets'),
    autoprefixer  = require('autoprefixer'),
    cssnano       = require('cssnano'),
    file          = require('gulp-file'),
    modernizr     = require('modernizr'),
    sourcemaps    = require('gulp-sourcemaps'),
    notify        = require('gulp-notify'),
    extend        = require('gulp-extend'),
    minimist      = require('minimist'),
    gulpif        = require('gulp-if'),
    runSequence   = require('run-sequence'),
    eslint        = require('gulp-eslint'),
    webpack       = require('webpack'),
    bump          = require('gulp-bump'),
    jeditor       = require('gulp-json-editor'),
    moment        = require('moment'),
    through       = require('through'),
    modernConfig  = require('./modernizr-config.json'),
    webpackConfig = require('./webpack.config.js'),
    myConfig      = Object.create(webpackConfig),

    // get configuration
    config           = require('./config.json'),
    rootFiles        = config.root,
    scssIncludePaths = config.scssIncludePaths,
    cssVendor        = config.cssVendor,

    // parse parameters
    argv = minimist(process.argv.slice(2), { boolean: true });

/**
 *
 *   Build config
 *
 */

var BUILD_DIR = 'website',
    AUTO_PREFIXER_RULES = ['last 2 versions'];

/**
 *
 *   Helper variables
 *
 */

var TASK_NOTIFICATION = false,
    LIVE_RELOAD = false,
    MODERNIZR_LIB;

/**
 *
 *   Webpack config
 *
 */

myConfig.output = {
    path: BUILD_DIR + '/scripts',
    publicPath: 'scripts/',
    filename: '[name].js',
    sourceMapFilename: 'maps/[file].map'
};

if (argv.dist) {
    myConfig.plugins = [new webpack.optimize.UglifyJsPlugin()];
} else {
    myConfig.debug = true;
    myConfig.devtool = '#cheap-module-source-map';
}

/**
 *
 *   Http and livereaload server
 *
 */

gulp.task('connect', function () {
    connect.server({
        root: [__dirname + '/' + BUILD_DIR],
        port: 8080,
        livereload: true,
        middleware: function () {
            return [
                modRewrite([
                    '^[^\.]*$ /index.html [L]'
                ])
            ];
        }
    });
});

/**
 *
 *   Bump version
 *
 */

gulp.task('bump', ['_version-timestamp'], function () {
    var bumpType;

    if (argv.major) {
        bumpType = 'major';
    } else if (argv.minor) {
        bumpType = 'minor';
    } else if (argv.patch) {
        bumpType = 'patch';
    } else {
        gutil.log(gutil.colors.blue('Specify valid semver version type to bump!'));
        return;
    }

    gulp.src([
        './bower.json',
        './package.json',
        './test/package.json',
        './src/scripts/data/version.json'
    ], { base: './' })
        .pipe(bump({ type: bumpType }))
        .pipe(gulp.dest('./'));
});

gulp.task('_version-timestamp', function () {
    return gulp.src('./src/scripts/data/version.json')
        .pipe(jeditor({ 'time': moment().format('DD.MM.YYYY HH:mm:ss (ZZ)') }))
        .pipe(gulp.dest('./src/scripts/data/'));
});

/**
 *
 *   Clean task
 *
 */

gulp.task('_clean', function () {
    return del([
        BUILD_DIR + '/css/*.*',
        BUILD_DIR + '/css/assets/*.*',
        BUILD_DIR + '/css/vendor/*.css',
        BUILD_DIR + '/css/vendor/*.map',
        BUILD_DIR + '/tpls/**',
        BUILD_DIR + '/scripts/**'
    ], { force: true });
});

/**
 *
 *   Build tasks
 *
 */

// Build main css
gulp.task('_css-build', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(gulpif(!argv.dist, sourcemaps.init()))
        .pipe(sass({ includePaths: scssIncludePaths })
        .on('error', notify.onError('Error: <%= error.message %>')))
        .pipe(gulpif(!argv.dist, postcss([
            assets({ basePath: BUILD_DIR }),
            autoprefixer({ browsers: AUTO_PREFIXER_RULES })
        ])))
        .pipe(gulpif(argv.dist, postcss([
            assets({ basePath: BUILD_DIR }),
            autoprefixer({ browsers: AUTO_PREFIXER_RULES }),
            cssnano
        ])))
        .pipe(gulpif(!argv.dist, sourcemaps.write('./')))
        .pipe(gulp.dest(BUILD_DIR + '/css/'))
        .pipe(gulpif(LIVE_RELOAD, connect.reload()))
        .pipe(gulpif(TASK_NOTIFICATION, notify({ message: 'CSS build completed.', onLast: true })));
});

// Build vendor css
gulp.task('_css-vendor-build', function () {
    return gulp.src(cssVendor)
        .pipe(gulpif(!argv.dist, sourcemaps.init()))
        .pipe(concat('vendor.css'))
        .pipe(gulpif(!argv.dist, postcss([
            autoprefixer({ browsers: AUTO_PREFIXER_RULES })
        ])))
        .pipe(gulpif(argv.dist, postcss([
            autoprefixer({ browsers: AUTO_PREFIXER_RULES }),
            cssnano
        ])))
        .pipe(gulpif(!argv.dist, sourcemaps.write('./')))
        .pipe(gulp.dest(BUILD_DIR + '/css/vendor/'))
        .pipe(gulpif(LIVE_RELOAD, connect.reload()))
        .pipe(gulpif(TASK_NOTIFICATION, notify({ message: 'Vendor CSS build completed.', onLast: true })));
});

// Build js files
var compiler = webpack(myConfig);

var _jsBuild = function (cb) {
    compiler.run(function (err, stats) {
        if (err) {
            throw new gutil.PluginError('_js-build', err);
        }

        gutil.log('[_js-build]', stats.toString({ colors: true }));

        if (stats.hasErrors()) {
            if (!TASK_NOTIFICATION) {
                throw new gutil.PluginError('_js-build', new Error('JavaScript build error.'));
            } else {
                file('noop.js', '', { src: true })
                    .pipe(through(function () {
                        this.emit('error', new Error()); // eslint-disable-line no-invalid-this
                    }))
                    .on('error', notify.onError('JavaScript build error.'));
            }
        } else {
            file('noop.js', '', { src: true })
                .pipe(gulpif(LIVE_RELOAD, connect.reload()))
                .pipe(gulpif(TASK_NOTIFICATION, notify({
                    message: 'JavaScript build completed.', onLast: true
                })));
        }

        cb();
    });
};

gulp.task('_js-build', _jsBuild);
gulp.task('_js-watch', function (cb) {
    runSequence('_lint', '_js-build', cb);
});

// Build modernizr js
gulp.task('_modernizr-generate', function (cb) {
    modernizr.build(modernConfig, function (result) {
        MODERNIZR_LIB = result;
        cb();
    });
});

gulp.task('_modernizr-build', ['_modernizr-generate'], function () {
    return file('modernizr.js', MODERNIZR_LIB, { src: true })
        .pipe(gulpif(argv.dist, uglify()))
        .pipe(gulp.dest(BUILD_DIR + '/scripts/'));
});

// Copy templates
gulp.task('_tpls-build', function () {
    return gulp.src('src/tpls/**/*.html')
        .pipe(gulp.dest(BUILD_DIR + '/tpls/'))
        .pipe(gulpif(LIVE_RELOAD, connect.reload()))
        .pipe(gulpif(TASK_NOTIFICATION, notify({ message: 'Template build completed.', onLast: true })));
});

// Copy root files
gulp.task('_root-files-build', function () {
    return gulp.src(rootFiles)
        .pipe(gulp.dest(BUILD_DIR + '/'))
        .pipe(gulpif(LIVE_RELOAD, connect.reload()))
        .pipe(gulpif(TASK_NOTIFICATION, notify({ message: 'Root files build completed.', onLast: true })));
});

// Build data
gulp.task('_data-build', function () {
    return gulp.src('src/data/**/*.json')
        .pipe(extend('data.json'))
        .pipe(gulp.dest(BUILD_DIR + '/data/'))
        .pipe(gulpif(LIVE_RELOAD, connect.reload()))
        .pipe(gulpif(TASK_NOTIFICATION, notify({ message: 'Data build completed.', onLast: true })));
});

/**
 *
 *   ESLint task
 *
 */

gulp.task('_lint', function () {
    return gulp.src(['src/scripts/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(notify(function (f) {
            if (f.eslint.errorCount === 0 && f.eslint.warningCount === 0) {
                return false;
            }
            return 'ESLint error';
        }));
});

/**
 *
 *   Main build task
 *
 */

gulp.task('_build', ['_css-build', '_css-vendor-build', '_tpls-build', '_js-build', '_modernizr-build',
'_root-files-build', '_data-build'], function (cb) {
    // HACK: Webpack watch build doesn't work on first file change
    // Run the build again to solve the issue
    runSequence('_js-build', function () {
        file('noop.js', '', { src: true }).pipe(notify('Build completed.'));
        cb();
    });
});

gulp.task('build', function (cb) {
    runSequence('_lint', '_clean', '_build', function () {
        TASK_NOTIFICATION = true;
        LIVE_RELOAD = true;
        cb();
    });
});

/**
 *
 *   Watch task
 *
 */

gulp.task('_watch', function () {
    gulp.watch('src/scss/**/*.scss', ['_css-build']);

    gulp.watch('src/scripts/**', ['_js-watch']);

    gulp.watch('src/tpls/**/*.html', ['_tpls-build']);

    gulp.watch(rootFiles, ['_root-files-build']);

    gulp.watch('src/data/**/*.json', ['_data-build']);
});

gulp.task('watch', function (cb) {
    runSequence('build', '_watch', 'connect', cb);
});

/**
 *
 *   Set DEFAULT task
 *
 */

gulp.task('default', ['watch']);
