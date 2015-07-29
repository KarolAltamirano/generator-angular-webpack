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
                type: 'checkbox',
                name: 'optionalLibraries',
                message: 'Select optional libraries to install',
                choices: [
                    {
                        name: 'SoundJS'
                    },
                    {
                        name: 'EaselJS'
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
            var installLib = function (name) { return props.optionalLibraries.indexOf(name) !== -1; };

            this.props = props;

            this.soundjs = installLib('SoundJS');
            this.easeljs = installLib('EaselJS');
            this.statsjs = installLib('stats.js');
            this.datgui = installLib('dat-gui');

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

        this.fs.copy(this.templatePath('src/scripts/app/**'), this.destinationPath('src/scripts/app/'));
        this.fs.copy(this.templatePath('src/scripts/data/**'), this.destinationPath('src/scripts/data/'));
        this.fs.copy(this.templatePath('src/scripts/globals/**'), this.destinationPath('src/scripts/globals/'));
        this.fs.copyTpl(
            this.templatePath('src/scripts/utilities/loader.js'),
            this.destinationPath('src/scripts/utilities/loader.js'),
            { soundjs: this.soundjs }
        );
        this.fs.copy(this.templatePath('src/scripts/utilities/loaderData.js'), this.destinationPath('src/scripts/utilities/loaderData.js'));
        this.fs.copy(this.templatePath('src/scripts/main.js'), this.destinationPath('src/scripts/main.js'));

        this.fs.copy(this.templatePath('src/scss/**'), this.destinationPath('src/scss/'));
        this.fs.copy(this.templatePath('src/tpls/**'), this.destinationPath('src/tpls/'));
        this.fs.copy(this.templatePath('src/.htaccess'), this.destinationPath('src/.htaccess'));
        this.fs.copy(this.templatePath('src/favicon.ico'), this.destinationPath('src/favicon.ico'));
        this.fs.copy(this.templatePath('src/index.html'), this.destinationPath('src/index.html'));

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
