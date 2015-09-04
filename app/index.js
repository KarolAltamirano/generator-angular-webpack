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
            }
        ];

        this.prompt(prompts, function (props) {
            var installLib = function (name, input) { return input.indexOf(name) !== -1; };

            this.props = props;

            this.pixijs = installLib('Pixi.js', props.canvasLibrarie);
            this.easeljs = installLib('EaselJS', props.canvasLibrarie);

            this.soundjs = installLib('SoundJS', props.optionalLibraries);
            this.statsjs = installLib('stats.js', props.optionalLibraries);
            this.datgui = installLib('dat-gui', props.optionalLibraries);

            done();
        }.bind(this));
    },
    writing: function () {
        // root files
        this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));

        this.fs.copyTpl(
            this.templatePath('_bower.json'),
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

        this.fs.copy(this.templatePath('config.json'), this.destinationPath('config.json'));

        this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath('gulpfile.js'));

        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            { name: this.props.name }
        );

        this.fs.copy(this.templatePath('README.md'), this.destinationPath('README.md'));

        this.fs.copy(this.templatePath('webpack.config.js'), this.destinationPath('webpack.config.js'));

        // src folder
        this.fs.copy(this.templatePath('src/assets/**'), this.destinationPath('src/assets/'));
        this.fs.copy(this.templatePath('src/data/**'), this.destinationPath('src/data/'));

        this.fs.copy(this.templatePath('src/scripts/app/animations/**'), this.destinationPath('src/scripts/app/animations/'));
        this.fs.copy(this.templatePath('src/scripts/app/controllers/**'), this.destinationPath('src/scripts/app/controllers/'));
        this.fs.copy(this.templatePath('src/scripts/app/directives/**'), this.destinationPath('src/scripts/app/directives/'));
        this.fs.copy(this.templatePath('src/scripts/app/services/**'), this.destinationPath('src/scripts/app/services'));
        this.fs.copyTpl(
            this.templatePath('src/scripts/app/mApp.js'),
            this.destinationPath('src/scripts/app/mApp.js'),
            { pixijs: this.pixijs }
        );

        if (this.pixijs) {
            this.fs.copy(this.templatePath('src/scripts/canvas/**'), this.destinationPath('src/scripts/canvas/'));
        }

        this.fs.copy(this.templatePath('src/scripts/data/**'), this.destinationPath('src/scripts/data/'));
        this.fs.copy(this.templatePath('src/scripts/globals/**'), this.destinationPath('src/scripts/globals/'));
        this.fs.copyTpl(
            this.templatePath('src/scripts/utilities/loader.js'),
            this.destinationPath('src/scripts/utilities/loader.js'),
            { soundjs: this.soundjs }
        );
        this.fs.copy(this.templatePath('src/scripts/utilities/loaderData.js'), this.destinationPath('src/scripts/utilities/loaderData.js'));
        this.fs.copy(this.templatePath('src/scripts/main.js'), this.destinationPath('src/scripts/main.js'));

        this.fs.copy(this.templatePath('src/scss/assets/**'), this.destinationPath('src/scss/assets/'));

        this.fs.copy(this.templatePath('src/scss/modules/_animation.scss'), this.destinationPath('src/scss/modules/_animation.scss'));
        if (this.pixijs) {
            this.fs.copy(this.templatePath('src/scss/modules/_canvas.scss'), this.destinationPath('src/scss/modules/_canvas.scss'));
        }
        this.fs.copy(this.templatePath('src/scss/modules/_incompatibleBrowser.scss'), this.destinationPath('src/scss/modules/_incompatibleBrowser.scss'));
        this.fs.copy(this.templatePath('src/scss/modules/_layout.scss'), this.destinationPath('src/scss/modules/_layout.scss'));
        this.fs.copy(this.templatePath('src/scss/modules/_loader.scss'), this.destinationPath('src/scss/modules/_loader.scss'));

        this.fs.copy(this.templatePath('src/scss/_base.scss'), this.destinationPath('src/scss/_base.scss'));
        this.fs.copy(this.templatePath('src/scss/_fonts.scss'), this.destinationPath('src/scss/_fonts.scss'));
        this.fs.copy(this.templatePath('src/scss/_shared.scss'), this.destinationPath('src/scss/_shared.scss'));
        this.fs.copyTpl(
            this.templatePath('src/scss/style.scss'),
            this.destinationPath('src/scss/style.scss'),
            { pixijs: this.pixijs }
        );

        this.fs.copy(this.templatePath('src/tpls/**'), this.destinationPath('src/tpls/'));
        this.fs.copy(this.templatePath('src/.htaccess'), this.destinationPath('src/.htaccess'));
        this.fs.copy(this.templatePath('src/favicon.ico'), this.destinationPath('src/favicon.ico'));
        this.fs.copyTpl(
            this.templatePath('src/index.html'),
            this.destinationPath('src/index.html'),
            { pixijs: this.pixijs }
        );

        // test folder
        this.fs.copy(this.templatePath('test/e2e/**'), this.destinationPath('test/e2e/'));
        this.fs.copy(this.templatePath('test/unit/**'), this.destinationPath('test/unit/'));
        this.fs.copy(this.templatePath('test/karma.conf.js'), this.destinationPath('test/karma.conf.js'));
        this.fs.copy(this.templatePath('test/protractor.conf.js'), this.destinationPath('test/protractor.conf.js'));

        this.fs.copyTpl(
            this.templatePath('test/_package.json'),
            this.destinationPath('test/package.json'),
            { name: this.props.name }
        );

        // website folder
        this.fs.copy(this.templatePath('website/**'), this.destinationPath('website/'));

    },
    install: function () {
        this.installDependencies();
    }
});
