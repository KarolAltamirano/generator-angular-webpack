/**
 * @file        Main file of Yeoman generator for AngularJS with Webpack
 * @author      Karol Altamirano <karlos.altamirano@gmail.com>
 * @copyright   2015-2016 Karol Altamirano
 * @license     MIT
 */

'use strict';

var generators = require('yeoman-generator'),
    chalk      = require('chalk'),
    yosay      = require('yosay'),
    _          = require('lodash');

module.exports = generators.Base.extend({
    prompting: function () {
        var done = this.async();

        this.log(yosay('Welcome to the ' + chalk.green('Angular-Webpack') + ' generator!'));

        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Your project name (use camelCase)',
                default: _.camelCase(this.appname)
            },
            {
                type: 'list',
                name: 'canvasLibrarie',
                message: 'Select canvas library',
                choices: ['Do not install', 'Pixi.js', 'EaselJS']
            },
            {
                type: 'checkbox',
                name: 'optionalLibraries',
                message: 'Select optional libraries to install',
                choices: [
                    {
                        name: 'SoundJS'
                    },
                    {
                        name: 'stats.js'
                    },
                    {
                        name: 'dat-gui'
                    }
                ]
            },
            {
                type: 'list',
                name: 'jsVersion',
                message: 'What JavaScript version do you want to use?',
                choices: ['ECMAScript 5', 'ECMAScript 2015 (with Babel compiler)']
            }
        ];

        this.prompt(prompts, function (props) {
            var selectedPrompt = function (name, input) { return input.indexOf(name) !== -1; };

            this.props = props;

            this.pixijs = selectedPrompt('Pixi.js', props.canvasLibrarie);
            this.easeljs = selectedPrompt('EaselJS', props.canvasLibrarie);

            this.soundjs = selectedPrompt('SoundJS', props.optionalLibraries);
            this.statsjs = selectedPrompt('stats.js', props.optionalLibraries);
            this.datgui = selectedPrompt('dat-gui', props.optionalLibraries);

            this.es2015 = selectedPrompt('ECMAScript 2015 (with Babel compiler)', props.jsVersion);

            done();
        }.bind(this));
    },
    writing: function () {
        var COMMON_FOLDER = 'common',
            VERSION_FOLDER;

        if (this.es2015) {
            VERSION_FOLDER = 'es2015';
        } else {
            VERSION_FOLDER = 'es5';
        }

        // root files
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/.editorconfig'), this.destinationPath('.editorconfig'));

        this.fs.copyTpl(
            this.templatePath(COMMON_FOLDER + '/_package.json'),
            this.destinationPath('package.json'),
            {
                name: this.props.name,
                es2015: this.es2015,
                pixijs: this.pixijs,
                soundjs: this.soundjs,
                easeljs: this.easeljs,
                statsjs: this.statsjs,
                datgui: this.datgui
            }
        );

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/.htmlhintrc'), this.destinationPath('.htmlhintrc'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/.scss-lint.yml'), this.destinationPath('.scss-lint.yml'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/config.json'), this.destinationPath('config.json'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/gitignore'), this.destinationPath('.gitignore'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/gulpfile.js'), this.destinationPath('gulpfile.js'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/karma.conf.js'), this.destinationPath('karma.conf.js'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/modernizr-config.json'), this.destinationPath('modernizr-config.json'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/protractor.conf.js'), this.destinationPath('protractor.conf.js'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/README.md'), this.destinationPath('README.md'));

        this.fs.copyTpl(
            this.templatePath(COMMON_FOLDER + '/webpack.config.js'),
            this.destinationPath('webpack.config.js'),
            {
                es2015: this.es2015,
                pixijs: this.pixijs,
                soundjs: this.soundjs,
                easeljs: this.easeljs,
                statsjs: this.statsjs,
                datgui: this.datgui
            }
        );

        if (this.es2015) {
            this.fs.copy(this.templatePath(VERSION_FOLDER + '/.babelrc'), this.destinationPath('.babelrc'));
        }

        this.fs.copy(this.templatePath(VERSION_FOLDER + '/.eslintrc'), this.destinationPath('.eslintrc'));

        // src folder
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/assets/**'), this.destinationPath('src/assets/'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/data/**'), this.destinationPath('src/data/'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scripts/data/**'), this.destinationPath('src/scripts/data/'));

        this.fs.copy(this.templatePath(VERSION_FOLDER + '/src/scripts/app/animations/**'), this.destinationPath('src/scripts/app/animations/'));
        this.fs.copy(this.templatePath(VERSION_FOLDER + '/src/scripts/app/controllers/**'), this.destinationPath('src/scripts/app/controllers/'));
        this.fs.copy(this.templatePath(VERSION_FOLDER + '/src/scripts/app/directives/**'), this.destinationPath('src/scripts/app/directives/'));
        this.fs.copy(this.templatePath(VERSION_FOLDER + '/src/scripts/app/services/**'), this.destinationPath('src/scripts/app/services'));
        this.fs.copy(this.templatePath(VERSION_FOLDER + '/src/scripts/app/utilities/**'), this.destinationPath('src/scripts/app/utilities'));
        this.fs.copyTpl(
            this.templatePath(VERSION_FOLDER + '/src/scripts/app/mApp.js'),
            this.destinationPath('src/scripts/app/mApp.js'),
            { pixijs: this.pixijs }
        );

        if (this.pixijs) {
            this.fs.copy(this.templatePath(VERSION_FOLDER + '/src/scripts/canvas/**'), this.destinationPath('src/scripts/canvas/'));
        }

        this.fs.copy(this.templatePath(VERSION_FOLDER + '/src/scripts/utilities/appSettings.js'), this.destinationPath('src/scripts/utilities/appSettings.js'));
        this.fs.copy(this.templatePath(VERSION_FOLDER + '/src/scripts/utilities/incompatible.js'), this.destinationPath('src/scripts/utilities/incompatible.js'));
        this.fs.copy(this.templatePath(VERSION_FOLDER + '/src/scripts/utilities/incompDetect.js'), this.destinationPath('src/scripts/utilities/incompDetect.js'));
        this.fs.copyTpl(
            this.templatePath(VERSION_FOLDER + '/src/scripts/utilities/loader.js'),
            this.destinationPath('src/scripts/utilities/loader.js'),
            { soundjs: this.soundjs, easeljs: this.easeljs }
        );
        this.fs.copy(this.templatePath(VERSION_FOLDER + '/src/scripts/utilities/loaderData.js'), this.destinationPath('src/scripts/utilities/loaderData.js'));
        this.fs.copy(this.templatePath(VERSION_FOLDER + '/src/scripts/utilities/version.js'), this.destinationPath('src/scripts/utilities/version.js'));
        this.fs.copy(this.templatePath(VERSION_FOLDER + '/src/scripts/main.js'), this.destinationPath('src/scripts/main.js'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/assets/**'), this.destinationPath('src/scss/assets/'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/modules/_animation.scss'), this.destinationPath('src/scss/modules/_animation.scss'));
        if (this.pixijs) {
            this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/modules/_canvas.scss'), this.destinationPath('src/scss/modules/_canvas.scss'));
        }
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/modules/_incompatible-browser.scss'), this.destinationPath('src/scss/modules/_incompatible-browser.scss'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/modules/_loader.scss'), this.destinationPath('src/scss/modules/_loader.scss'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/modules/_version.scss'), this.destinationPath('src/scss/modules/_version.scss'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/_base.scss'), this.destinationPath('src/scss/_base.scss'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/_fonts.scss'), this.destinationPath('src/scss/_fonts.scss'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/_shared.scss'), this.destinationPath('src/scss/_shared.scss'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/style.scss'), this.destinationPath('src/scss/style.scss'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/tpls/**'), this.destinationPath('src/tpls/'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/.htaccess'), this.destinationPath('src/.htaccess'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/favicon.ico'), this.destinationPath('src/favicon.ico'));
        this.fs.copyTpl(
            this.templatePath(COMMON_FOLDER + '/src/index.html'),
            this.destinationPath('src/index.html'),
            { pixijs: this.pixijs }
        );

        // test folder
        this.fs.copy(this.templatePath(VERSION_FOLDER + '/test/e2e/**'), this.destinationPath('test/e2e/'));
        this.fs.copy(this.templatePath(VERSION_FOLDER + '/test/unit/**'), this.destinationPath('test/unit/'));

        // website folder
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/website/**'), this.destinationPath('website/'));

    },
    install: function () {
        this.npmInstall();
    }
});
