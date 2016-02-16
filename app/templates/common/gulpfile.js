'use strict';

/**
 *
 *      gulp build        - build for development
 *      gulp watch        - build and watch files for change
 *      gulp              - default task [watch]
 *      gulp build --dist - build for production
 *      gulp browser-sync - create http server for testing
 *      gulp bump --major - bump major version
 *      gulp bump --minor - bump minor version
 *      gulp bump --patch - bump patch version
 *
 */

var del                = require('del'),
    path               = require('path'),
    gulp               = require('gulp'),
    gutil              = require('gulp-util'),
    concat             = require('gulp-concat'),
    browserSync        = require('browser-sync').create(),
    historyApiFallback = require('connect-history-api-fallback'),
    uglify             = require('gulp-uglify'),
    sass               = require('gulp-sass'),
    postcss            = require('gulp-postcss'),
    assets             = require('postcss-assets'),
    autoprefixer       = require('autoprefixer'),
    cssnano            = require('cssnano'),
    file               = require('gulp-file'),
    modernizr          = require('modernizr'),
    sourcemaps         = require('gulp-sourcemaps'),
    notify             = require('gulp-notify'),
    notifier           = require('node-notifier'),
    extend             = require('gulp-extend'),
    jsonlint           = require('gulp-jsonlint'),
    minimist           = require('minimist'),
    gulpif             = require('gulp-if'),
    runSequence        = require('run-sequence'),
    eslint             = require('gulp-eslint'),
    webpack            = require('webpack'),
    bump               = require('gulp-bump'),
    jeditor            = require('gulp-json-editor'),
    moment             = require('moment'),
    modernConfig       = require('./modernizr-config.json'),
    webpackConfig      = require('./webpack.config.js'),
    myConfig           = Object.create(webpackConfig),

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
    MODERNIZR_LIB,
    BUMP_TYPE;

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
 *  Server
 *
 */

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: './' + BUILD_DIR,
            middleware: [historyApiFallback()]
        }
    });
});

/**
 *
 *   Bump version
 *
 */

gulp.task('bump', function (cb) {
    if (argv.major) {
        BUMP_TYPE = 'major';
    } else if (argv.minor) {
        BUMP_TYPE = 'minor';
    } else if (argv.patch) {
        BUMP_TYPE = 'patch';
    } else {
        cb();
        gutil.log(gutil.colors.blue('Specify valid semver version type to bump!'));
        return;
    }

    runSequence('_version-timestamp', '_version-bump', cb);
});

gulp.task('_version-timestamp', function () {
    return gulp.src('./src/scripts/data/version.json')
        .pipe(jeditor({ 'time': moment().format('DD.MM.YYYY HH:mm:ss (ZZ)') }))
        .pipe(gulp.dest('./src/scripts/data/'));
});

gulp.task('_version-bump', function () {
    return gulp.src([
        './bower.json',
        './package.json',
        './test/package.json',
        './src/scripts/data/version.json'
    ], { base: './' })
        .pipe(bump({ type: BUMP_TYPE }))
        .pipe(gulp.dest('./'));
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
        .pipe(gulpif(LIVE_RELOAD, browserSync.stream()))
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
        .pipe(gulpif(LIVE_RELOAD, browserSync.stream()))
        .pipe(gulpif(TASK_NOTIFICATION, notify({ message: 'Vendor CSS build completed.', onLast: true })));
});

// Build js files
var compiler = webpack(myConfig);

gulp.task('_js-build', function (cb) {
    compiler.purgeInputFileSystem();
    compiler.run(function (err, stats) {
        if (err) {
            throw new gutil.PluginError('_js-build', err);
        }

        gutil.log('[_js-build]', stats.toString({ colors: true }));

        if (stats.hasErrors()) {
            if (!TASK_NOTIFICATION) {
                throw new gutil.PluginError('_js-build', new Error('JavaScript build error.'));
            } else {
                notifier.notify({
                    title: 'Error running Gulp',
                    message: 'JavaScript build error.',
                    icon: path.join(__dirname, 'node_modules', 'gulp-notify', 'assets', 'gulp-error.png'),
                    sound: 'Frog'
                });
            }
        } else {
            if (TASK_NOTIFICATION) {
                notifier.notify({
                    title: 'Gulp notification',
                    message: 'JavaScript build completed.',
                    icon: path.join(__dirname, 'node_modules', 'gulp-notify', 'assets', 'gulp.png')
                });
            }

            if (LIVE_RELOAD) {
                browserSync.reload();
            }
        }

        cb();
    });
});

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
        .pipe(gulpif(LIVE_RELOAD, browserSync.stream()))
        .pipe(gulpif(TASK_NOTIFICATION, notify({ message: 'Template build completed.', onLast: true })));
});

// Copy root files
gulp.task('_root-files-build', function () {
    return gulp.src(rootFiles)
        .pipe(gulp.dest(BUILD_DIR + '/'))
        .pipe(gulpif(LIVE_RELOAD, browserSync.stream()))
        .pipe(gulpif(TASK_NOTIFICATION, notify({ message: 'Root files build completed.', onLast: true })));
});

// Build data
gulp.task('_data-build', function () {
    return gulp.src('src/data/**/*.json')
        .pipe(jsonlint())
        .pipe(jsonlint.reporter())
        .pipe(jsonlint.failOnError())
        .on('error', notify.onError('JSON data build error.'))
        .pipe(extend('data.json'))
        .pipe(gulp.dest(BUILD_DIR + '/data/'))
        .pipe(gulpif(LIVE_RELOAD, browserSync.stream()))
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
        .pipe(eslint.results(function (results) {
            if (results.errorCount === 0 && results.warningCount === 0) {
                return;
            }

            notifier.notify({
                title: 'Error running Gulp',
                message: 'JavaScript ESLint error.',
                icon: path.join(__dirname, 'node_modules', 'gulp-notify', 'assets', 'gulp-error.png'),
                sound: 'Frog'
            });
        }));
});

/**
 *
 *   Main build task
 *
 */

gulp.task('_build', ['_css-build', '_css-vendor-build', '_tpls-build', '_js-build', '_modernizr-build',
'_root-files-build', '_data-build'], function () {
    notifier.notify({
        title: 'Gulp notification',
        message: 'Build completed.',
        icon: path.join(__dirname, 'node_modules', 'gulp-notify', 'assets', 'gulp.png')
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
    runSequence('build', '_watch', 'browser-sync', cb);
});

/**
 *
 *   Set DEFAULT task
 *
 */

gulp.task('default', ['watch']);
