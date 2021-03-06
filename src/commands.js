"use strict";

var chalk = require('chalk'),
    Setup = require('./commands/setup/setup'),
    Init = require('./commands/init/init'),
    Info = require('./commands/info/info'),
    Create = require('./commands/create/create'),
    path = require('path'),
    fs = require('fs'),
    ConfigClass = require('./config');

function err(e) {
  console.log(chalk.red('Something went wrong'));
  console.log(e.message);
}

function success() {
  console.log('');
  console.log('');
  console.log(chalk.green('Done'));
}

var configFile = path.join(path.dirname(fs.realpathSync(__filename)), 'config.yml'),
    Config = new ConfigClass(configFile);

var commands = {
  getConfig: function() {
    return Config;
  },

  setup: function(repository, options) {
    var command = new Setup();

    command.setOptions(options);
    command.setConfig(Config);

    command.exec(repository)
        .then(function() {
          var command = new Info(),
              Config = new ConfigClass(configFile);

          command.setConfig(Config);
          return command.exec();
        })
        .then(success)
        .catch(err);
  },

  init: function(repository, options) {
    var command = new Init();

    command.setOptions(options);
    command.setConfig(Config);

    command.exec(repository)
        .then(function() {
          var command = new Info(),
              Config = new ConfigClass(configFile);

          command.setConfig(Config);
          return command.exec();
        })
        .then(success)
        .catch(err);
  },

  info: function(component) {
    var command = new Info();

    command.setConfig(Config);

    command.setComponent(component);

    command.exec()
        .then(success)
        .catch(err);
  },

  create: function(component, parameters, template, options) {
    var command = new Create();

    command.setConfig(Config);

    command.setComponent(component);
    command.setParameters(parameters);
    command.setTemplate(template);
    command.setOptions(options);


    command.exec()
        .then(success)
        .catch(err);
  }
};

module.exports = commands;
