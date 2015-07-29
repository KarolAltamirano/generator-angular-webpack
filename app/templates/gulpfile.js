'use strict';

/**
 *
 *      gulp build        - build for development
 *      gulp watch        - build and watch files for change
 *      gulp              - default task [watch]
 *      gulp build --dist - build for production
 *      gulp connect      - create http server for testing production version
 *
 */

var del           = require('del'),
    gulp          = require('gulp'),
    gutil         = require('gulp-util'),
    compass       = require('gulp-compass'),
    concat        = require('gulp-concat'),
    connect       = require('gulp-connect'),
    modRewrite    = require('connect-modrewrite'),
    uglify        = require('gulp-uglify'),
    minifyCss     = require('gulp-minify-css'),
    bowerFiles    = require('main-bower-files'),
    sourcemaps    = require('gulp-sourcemaps'),
    notifier      = require('node-notifier'),
    extend        = require('gulp-extend'),
    minimist      = require('minimist'),
    gulpif        = require('gulp-if'),
    htmlreplace   = require('gulp-html-replace'),
    webpack       = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    myConfig      = Object.create(webpackConfig),

    // get load order of js and css files and list of root files to load
    config        = require('./config.json'),
    jsHeader      = config.jsHeader,
    cssFiles      = config.css,
    rootFiles     = config.root,

    // parse parameters
    argv          = minimist(process.argv.slice(2), { boolean: 'dist' });

/**
 *
 *   Build config
 *
 */

var BUILD_DIR = 'website';

/**
 *
 *   Webpack config
 *
 */

myConfig.output = {
    filename: BUILD_DIR + '/scripts/main.js',
    sourceMapFilename: BUILD_DIR + '/scripts/maps/main.js.map'
};

if (argv.dist) {
    myConfig.plugins = [
        new webpack.optimize.UglifyJsPlugin()
    ];
} else {
    myConfig.debug = true;
    myConfig.devtool = '#source-map';
}

/**
 *
 *   Http and livereaload server for development
 *
 */

gulp.task('_connect', ['build'], function () {
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

gulp.task('connect', function () {
    connect.server({
        root: [__dirname + '/' + BUILD_DIR],
        port: 8080,
        livereload: false,
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
 *   Clean task
 *
 */

gulp.task('_clean', function (cb) {
    del([
        BUILD_DIR + '/css/*.*',
        BUILD_DIR + '/css/assets/*.*',
        BUILD_DIR + '/css/vendor/*.css',
        BUILD_DIR + '/css/vendor/*.map',
        BUILD_DIR + '/tpls/**',
        BUILD_DIR + '/scripts/**'
    ], { force: true }, cb);
});

/**
 *
 *   Build tasks
 *
 */

// generate css with compass
var _cssBuild = function () {
    return gulp.src(cssFiles)
        .pipe(compass({
            http_path: BUILD_DIR + '/',
            css: BUILD_DIR + '/css/',
            sass: 'src/scss/',
            image: BUILD_DIR + '/assets/',
            font: BUILD_DIR + '/assets/fonts/',
            sourcemap: !argv.dist,
            style: (argv.dist ? 'compressed' : 'nested'),
            import_path: [
                'bower_components/compass-breakpoint/stylesheets/',
                'bower_components/sassy-maps/sass/'
            ]
        }))
        .on('error', function () { notifier.notify({ 'title': 'Gulp', 'message': 'CSS Error' }); });
};

gulp.task('_css-build', ['_clean'], _cssBuild);
gulp.task('_css-watch-build', _cssBuild);

// build vendor css
var _cssVendorBuild = function () {
    if (bowerFiles('**/*.css').length === 0) {
        return;
    }

    return gulp.src(bowerFiles('**/*.css'))
        .pipe(gulpif(!argv.dist, sourcemaps.init()))
        .pipe(concat('vendor.css'))
        .pipe(gulpif(argv.dist, minifyCss()))
        .pipe(gulpif(!argv.dist, sourcemaps.write('./')))
        .pipe(gulp.dest(BUILD_DIR + '/css/vendor/'));
};

gulp.task('_css-vendor-build', ['_clean'], _cssVendorBuild);
gulp.task('_css-vendor-watch-build', _cssVendorBuild);

// build main js loaded in bottom of page
var _jsMainBuild = function (cb) {
    webpack(myConfig, function (err, stats) {
        if (err) {
            throw new gutil.PluginError('_jsMainBuild', err);
        }
        gutil.log('_jsMainBuild', stats.toString({ colors: true }));
        cb();
    });
};

gulp.task('_js-main-build', ['_clean'], _jsMainBuild);
gulp.task('_js-main-watch-build', _jsMainBuild);

// build js vendor lib loaded in bottom of page
var _jsLibBuild = function () {
    return gulp.src(bowerFiles('**/*.js'))
        .pipe(gulpif(!argv.dist, sourcemaps.init()))
        .pipe(concat('lib.js'))
        .pipe(gulpif(argv.dist, uglify()))
        .pipe(gulpif(!argv.dist, sourcemaps.write('maps/')))
        .pipe(gulp.dest(BUILD_DIR + '/scripts/'));
};

gulp.task('_js-lib-build', ['_clean'], _jsLibBuild);
gulp.task('_js-lib-watch-build', _jsLibBuild);

// build js vendor lib loaded in header of page
var _jsHeaderBuild = function () {
    return gulp.src(jsHeader)
        .pipe(gulpif(!argv.dist, sourcemaps.init()))
        .pipe(concat('priority.js'))
        .pipe(gulpif(argv.dist, uglify()))
        .pipe(gulpif(!argv.dist, sourcemaps.write('maps/')))
        .pipe(gulp.dest(BUILD_DIR + '/scripts/'));
};

gulp.task('_js-header-build', ['_clean'], _jsHeaderBuild);
gulp.task('_js-header-watch-build', _jsHeaderBuild);

// generate templates
var _tplsBuild = function () {
    return gulp.src('src/tpls/**/*.html')
        .pipe(gulp.dest(BUILD_DIR + '/tpls/'));
};

gulp.task('_tpls-build', ['_clean'], _tplsBuild);
gulp.task('_tpls-watch-build', _tplsBuild);

// copy root files
gulp.task('_root-files-build', function () {
    return gulp.src(rootFiles)
        .pipe(gulp.dest(BUILD_DIR + '/'));
});

// build index
gulp.task('_index-build', function () {
    var hasVendorCss = bowerFiles('**/*.css').length !== 0 ? true : false;

    return gulp.src('src/index.html')
        .pipe(gulpif(hasVendorCss, htmlreplace({ vendorCss: 'css/vendor/vendor.css' })))
        .pipe(gulpif(!hasVendorCss, htmlreplace({ vendorCss: '' })))
        .pipe(gulp.dest(BUILD_DIR));
});

// data build
gulp.task('_data-build', function () {
    return gulp.src('src/data/**/*.json')
        .pipe(extend('data.json'))
        .pipe(gulp.dest(BUILD_DIR + '/data/'));
});

/**
 *
 *   Main build task
 *
 */

gulp.task('build', ['_css-build', '_css-vendor-build', '_tpls-build', '_js-main-build', '_js-header-build',
          '_js-lib-build', '_root-files-build', '_index-build', '_data-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'Build completed.' });
    gutil.log(gutil.colors.green('... completed ...'));
});

/**
 *
 *   Watch tasks with notification
 *
 */

gulp.task('_css-watch', ['_css-watch-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'CSS build completed.' });
    gutil.log(gutil.colors.green('... completed ...'));
});

gulp.task('_css-vendor-watch', ['_css-vendor-watch-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'CSS vendor build completed.' });
    gutil.log(gutil.colors.green('... completed ...'));
});

gulp.task('_js-main-watch', ['_js-main-watch-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'JS build completed.' });
    gutil.log(gutil.colors.green('... completed ...'));
});

gulp.task('_js-lib-watch', ['_js-lib-watch-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'JS build completed.' });
    gutil.log(gutil.colors.green('... completed ...'));
});

gulp.task('_js-header-watch', ['_js-header-watch-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'JS build completed.' });
    gutil.log(gutil.colors.green('... completed ...'));
});

gulp.task('_tpls-watch', ['_tpls-watch-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'TEMPLATE build completed.' });
    gutil.log(gutil.colors.green('... completed ...'));
});

gulp.task('_root-files-watch', ['_root-files-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'ROOT FILES build completed.' });
    gutil.log(gutil.colors.green('... completed ...'));
});

gulp.task('_index-watch', ['_index-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'INDEX FILE build completed.' });
    gutil.log(gutil.colors.green('... completed ...'));
});

gulp.task('_data-watch', ['_data-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'DATA build completed.' });
    gutil.log(gutil.colors.green('... completed ...'));
});

gulp.task('_live-reload', function () {
    gulp.src(BUILD_DIR + '/index.html').pipe(connect.reload());
    gutil.log(gutil.colors.green('... live reload ...'));
});

/**
 *
 *   Main watch task
 *
 */

gulp.task('watch', ['build', '_connect'], function () {
    gulp.watch('src/scss/**/*.scss', ['_css-watch']);
    gulp.watch('bower_components/**', ['_css-vendor-watch']);

    gulp.watch('src/scripts/**', ['_js-main-watch']);
    gulp.watch('bower_components/**', ['_js-lib-watch']);
    gulp.watch(jsHeader, ['_js-header-watch']);

    gulp.watch('src/tpls/**/*.html', ['_tpls-watch']);

    gulp.watch(rootFiles, ['_root-files-watch']);
    gulp.watch('bower_components/**', ['_index-watch']);

    gulp.watch('src/data/**/*.json', ['_data-watch']);

    gulp.watch([BUILD_DIR + '/**', '!' + BUILD_DIR + '/**/*.map', '!' + BUILD_DIR + '/assets/**'], ['_live-reload']);
});

/**
 *
 *   Set DEFAULT task
 *
 */

gulp.task('default', ['watch']);
