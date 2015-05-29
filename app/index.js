'use strict';

var generators = require('yeoman-generator'),
    chalk      = require('chalk'),
    yosay      = require('yosay');

module.exports = generators.Base.extend({
    prompting: function () {
        var done = this.async();

        this.log(yosay('Welcome to the ' + chalk.green('Angular-Webpack') + ' generator!'));

        var prompts = [{
            type: 'input',
            name: 'name',
            message: 'Your project name (use camelCase):',
            default: this.appname
        }];

        this.prompt(prompts, function (props) {
            this.props = props;
            done();
        }.bind(this));
    },
    writing: function () {
        // root files
        this.fs.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'));

        this.fs.copyTpl(
            this.templatePath('_bower.json'),
            this.destinationPath('bower.json'),
            { name: this.props.name }
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
        this.fs.copy(this.templatePath('src/**'), this.destinationPath('src/'));

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
        this.installDependencies({
            npm: true,
            bower: false,
            callback: function () {
                this.spawnCommand('gulp', ['bower']);
            }.bind(this)
        });
    }
});
