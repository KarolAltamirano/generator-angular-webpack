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
    bower         = require('gulp-bower'),
    compass       = require('gulp-compass'),
    concat        = require('gulp-concat'),
    connect       = require('gulp-connect'),
    modRewrite    = require('connect-modrewrite'),
    uglify        = require('gulp-uglify'),
    bowerFiles    = require('main-bower-files'),
    sourcemaps    = require('gulp-sourcemaps'),
    notifier      = require('node-notifier'),
    extend        = require('gulp-extend'),
    chalk         = require('chalk'),
    minimist      = require('minimist'),
    gulpif        = require('gulp-if'),
    webpack       = require('gulp-webpack-build'),

    // get load order of js and css files and list of root files to load
    config        = require('./config.json'),
    jsHeader      = config.jsHeader,
    jsLib         = config.jsLib,
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

var webpackOptions, webpackConfig;

if (argv.dist) {
    webpackOptions = {
        plugins: [
            new webpack.core.optimize.UglifyJsPlugin()
        ]
    };
} else {
    webpackOptions = {
        debug: true,
        devtool: '#source-map'
    };
}

webpackConfig = {
    useMemoryFs: true,
    progress: true
};

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
 *   Bower JS library initialization
 *
 */

gulp.task('_bower', function () {
    return bower()
        .on('error', function (e) {
            console.log(chalk.bgRed(e.data.endpoint.name));
            if (e.details) { console.log(chalk.bgRed(e.details)); }
            console.log(chalk.bgRed(e.message));
        })
        .pipe(gulp.dest('bower_components/'));
});

gulp.task('bower', ['_bower'], function () {
    return gulp.src(bowerFiles()).pipe(gulp.dest('src/scripts/vendor/'));
});

/**
 *
 *   Clean task
 *
 */

gulp.task('_clean', function (cb) {
    del([
        BUILD_DIR + '/css/**/*',
        BUILD_DIR + '/tpls/**/*',
        BUILD_DIR + '/scripts/**/*'
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
            style: (argv.dist ? 'compressed' : 'nested')
        }))
        .on('error', function () { notifier.notify({ 'title': 'Gulp', 'message': 'CSS Error' }); });
};

gulp.task('_css-build', ['_clean'], _cssBuild);
gulp.task('_css-watch-build', _cssBuild);

// build main js loaded in bottom of page
gulp.task('_js-main-build', function () {
    return gulp.src('webpack.config.js')
        .pipe(webpack.init(webpackConfig))
        .pipe(webpack.props(webpackOptions))
        .pipe(webpack.run())
        .pipe(webpack.format({ verbose: true }))
        .pipe(gulp.dest(BUILD_DIR + '/scripts/'));
});

// build js vendor lib loaded in bottom of page
gulp.task('_js-lib-build', function () {
    return gulp.src(jsLib)
        .pipe(gulpif(!argv.dist, sourcemaps.init()))
        .pipe(concat('lib.js'))
        .pipe(gulpif(argv.dist, uglify()))
        .pipe(gulpif(!argv.dist, sourcemaps.write('maps/')))
        .pipe(gulp.dest(BUILD_DIR + '/scripts/'));
});

// build js vendor lib loaded in header of page
gulp.task('_js-header-build', function () {
    return gulp.src(jsHeader)
        .pipe(gulpif(!argv.dist, sourcemaps.init()))
        .pipe(concat('priority.js'))
        .pipe(gulpif(argv.dist, uglify()))
        .pipe(gulpif(!argv.dist, sourcemaps.write('maps/')))
        .pipe(gulp.dest(BUILD_DIR + '/scripts/'));
});

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

gulp.task('build', ['_css-build', '_tpls-build', '_js-main-build', '_js-header-build',
          '_js-lib-build', '_root-files-build', '_data-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'Build completed.' });
    console.log(chalk.green('... completed ...'));
});

/**
 *
 *   Watch tasks with notification
 *
 */

gulp.task('_css-watch', ['_css-watch-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'CSS build completed.' });
    console.log(chalk.green('... completed ...'));
});

gulp.task('_js-main-watch', ['_js-main-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'JS build completed.' });
    console.log(chalk.green('... completed ...'));
});

gulp.task('_js-lib-watch', ['_js-lib-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'JS build completed.' });
    console.log(chalk.green('... completed ...'));
});

gulp.task('_js-header-watch', ['_js-header-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'JS build completed.' });
    console.log(chalk.green('... completed ...'));
});

gulp.task('_tpls-watch', ['_tpls-watch-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'TEMPLATE build completed.' });
    console.log(chalk.green('... completed ...'));
});

gulp.task('_root-files-watch', ['_root-files-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'ROOT FILES build completed.' });
    console.log(chalk.green('... completed ...'));
});

gulp.task('_data-watch', ['_data-build'], function () {
    notifier.notify({ 'title': 'Gulp', 'message': 'DATA build completed.' });
    console.log(chalk.green('... completed ...'));
});

gulp.task('_live-reload', function () {
    gulp.src(BUILD_DIR + '/index.html').pipe(connect.reload());
    console.log(chalk.green('... live reload ...'));
});

/**
 *
 *   Main watch task
 *
 */

gulp.task('watch', ['build', '_connect'], function () {
    gulp.watch('src/scss/**/*.scss', ['_css-watch']);

    gulp.watch('src/scripts/**', ['_js-main-watch']);
    gulp.watch(jsLib, ['_js-lib-watch']);
    gulp.watch(jsHeader, ['_js-header-watch']);

    gulp.watch('src/tpls/**/*.html', ['_tpls-watch']);
    gulp.watch(rootFiles, ['_root-files-watch']);
    gulp.watch('src/data/**/*.json', ['_data-watch']);

    gulp.watch([BUILD_DIR + '/**', '!' + BUILD_DIR + '/**/*.map', '!' + BUILD_DIR + '/assets/**'], ['_live-reload']);
});

/**
 *
 *   Set DEFAULT task
 *
 */

gulp.task('default', ['watch']);
