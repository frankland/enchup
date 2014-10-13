"use strict";

var chalk = require('chalk'),
  Setup = require('./commands/setup/setup'),
  Info = require('./commands/info/info'),
  Create = require('./commands/create/create'),
  path = require('path'),
  fs = require('fs'),
  ConfigInterface = require('./config');

function err(e){
  console.log(chalk.yellow('---------------'));
  console.log(chalk.red('Error happened :('));
  console.log(e.message);
  console.log(chalk.yellow('---------------'));

  var stack = new Error().stack;
  console.log(chalk.yellow(stack));
}

function success(){
  console.log(chalk.yellow('---------------'));
  console.log(chalk.magenta('Done'));
  console.log(chalk.yellow('---------------'));
}


var configFile = path.join(path.dirname(fs.realpathSync(__filename)), 'config.yml'),
  Config = new ConfigInterface(configFile);

var commands = {
  setup: function(repository, options){
    var command = new Setup();

    command.setOptions(options);
    command.setConfig(Config);

    command.exec(repository)
      .then(success)
      .catch(err);
  },

  info: function(){
    var command = new Info();

    command.setConfig(Config);

    command.exec()
      .then(success)
      .catch(err);
  },

  create: function(component, parameters, template, options){
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