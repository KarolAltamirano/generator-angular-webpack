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

            if (selectedPrompt('ECMAScript 5', props.jsVersion)) {
                this.jsVersion = 'ES5';
            } else {
                this.jsVersion = 'ES2015';
            }

            done();
        }.bind(this));
    },
    writing: function () {
        var COMMON_FOLDER = 'common',
            VERSION_FOLDER;

        if (this.jsVersion === 'ES5') {
            VERSION_FOLDER = 'es5';
        } else {
            VERSION_FOLDER = 'es2015';
        }

        // root files
        this.fs.copyTpl(
            this.templatePath(COMMON_FOLDER + '/_bower.json'),
            this.destinationPath('bower.json'),
            {
                name: this.props.name,
                pixijs: this.pixijs,
                soundjs: this.soundjs,
                easeljs: this.easeljs,
                statsjs: this.statsjs,
                datgui: this.datgui
            }
        );

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/.eslintrc'), this.destinationPath('.eslintrc'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/.htmlhintrc'), this.destinationPath('.htmlhintrc'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/.scss-lint.yml'), this.destinationPath('.scss-lint.yml'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/gitignore'), this.destinationPath('.gitignore'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/gulpfile.js'), this.destinationPath('gulpfile.js'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/README.md'), this.destinationPath('README.md'));

        this.fs.copyTpl(
            this.templatePath(VERSION_FOLDER + '/_package.json'),
            this.destinationPath('package.json'),
            { name: this.props.name }
        );

        this.fs.copy(this.templatePath(VERSION_FOLDER + '/config.json'), this.destinationPath('config.json'));

        this.fs.copy(this.templatePath(VERSION_FOLDER + '/webpack.config.js'), this.destinationPath('webpack.config.js'));

        // src folder
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/assets/**'), this.destinationPath('src/assets/'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/data/**'), this.destinationPath('src/data/'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scripts/app/animations/**'), this.destinationPath('src/scripts/app/animations/'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scripts/app/controllers/**'), this.destinationPath('src/scripts/app/controllers/'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scripts/app/directives/**'), this.destinationPath('src/scripts/app/directives/'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scripts/app/services/**'), this.destinationPath('src/scripts/app/services'));
        this.fs.copyTpl(
            this.templatePath(COMMON_FOLDER + '/src/scripts/app/mApp.js'),
            this.destinationPath('src/scripts/app/mApp.js'),
            { pixijs: this.pixijs }
        );

        if (this.pixijs) {
            this.fs.copy(this.templatePath(VERSION_FOLDER + '/src/scripts/canvas/**'), this.destinationPath('src/scripts/canvas/'));
        }

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scripts/data/**'), this.destinationPath('src/scripts/data/'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scripts/utilities/appSettings.js'), this.destinationPath('src/scripts/utilities/appSettings.js'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scripts/utilities/incompatible.js'), this.destinationPath('src/scripts/utilities/incompatible.js'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scripts/utilities/incompDetect.js'), this.destinationPath('src/scripts/utilities/incompDetect.js'));
        this.fs.copyTpl(
            this.templatePath(COMMON_FOLDER + '/src/scripts/utilities/loader.js'),
            this.destinationPath('src/scripts/utilities/loader.js'),
            { soundjs: this.soundjs }
        );
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scripts/utilities/loaderData.js'), this.destinationPath('src/scripts/utilities/loaderData.js'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scripts/utilities/version.js'), this.destinationPath('src/scripts/utilities/version.js'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scripts/header.js'), this.destinationPath('src/scripts/header.js'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scripts/main.js'), this.destinationPath('src/scripts/main.js'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/assets/**'), this.destinationPath('src/scss/assets/'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/modules/_animation.scss'), this.destinationPath('src/scss/modules/_animation.scss'));
        if (this.pixijs) {
            this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/modules/_canvas.scss'), this.destinationPath('src/scss/modules/_canvas.scss'));
        }
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/modules/_incompatible-browser.scss'), this.destinationPath('src/scss/modules/_incompatible-browser.scss'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/modules/_layout.scss'), this.destinationPath('src/scss/modules/_layout.scss'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/modules/_loader.scss'), this.destinationPath('src/scss/modules/_loader.scss'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/modules/_version.scss'), this.destinationPath('src/scss/modules/_version.scss'));

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/_base.scss'), this.destinationPath('src/scss/_base.scss'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/_fonts.scss'), this.destinationPath('src/scss/_fonts.scss'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/scss/_shared.scss'), this.destinationPath('src/scss/_shared.scss'));
        this.fs.copyTpl(
            this.templatePath(COMMON_FOLDER + '/src/scss/style.scss'),
            this.destinationPath('src/scss/style.scss'),
            { pixijs: this.pixijs }
        );

        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/tpls/**'), this.destinationPath('src/tpls/'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/.htaccess'), this.destinationPath('src/.htaccess'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/src/favicon.ico'), this.destinationPath('src/favicon.ico'));
        this.fs.copyTpl(
            this.templatePath(COMMON_FOLDER + '/src/index.html'),
            this.destinationPath('src/index.html'),
            { pixijs: this.pixijs }
        );

        // test folder
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/test/e2e/**'), this.destinationPath('test/e2e/'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/test/unit/**'), this.destinationPath('test/unit/'));
        this.fs.copy(this.templatePath(VERSION_FOLDER + '/test/karma.conf.js'), this.destinationPath('test/karma.conf.js'));
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/test/protractor.conf.js'), this.destinationPath('test/protractor.conf.js'));

        this.fs.copyTpl(
            this.templatePath(VERSION_FOLDER + '/test/_package.json'),
            this.destinationPath('test/package.json'),
            { name: this.props.name }
        );

        // website folder
        this.fs.copy(this.templatePath(COMMON_FOLDER + '/website/**'), this.destinationPath('website/'));

    },
    install: function () {
        this.installDependencies();
    }
});
