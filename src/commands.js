"use strict";

var chalk = require('chalk'),
  setup = require('./commands/setup'),
  info = require('./commands/info'),
  generate = require('./commands/generate'),
  create = require('./commands/create');

function err(e){
  console.log(chalk.red(chalk.underline('Error')));
  console.log(e.message);
}

var commands = {
  setup: function(enchup, options){

    return setup
      .run(enchup, options)
      .catch(err);
  },

  info: function(){

    return info
      .run()
      .catch(err);
  },

  generate: function(options){
    var result;

    if (options.hasOwnProperty('info') && options.info){
      result = generate
        .info()
        .catch(err);
    } else {
       result = generate
        .run()
        .catch(err);
    }

    return result;
  },

  create: function(component, name, template){

  }
};

module.exports = commands;