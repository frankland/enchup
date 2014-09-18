"use strict";

var chalk = require('chalk'),
  setup = require('./commands/setup'),
  info = require('./commands/info'),
  generate = require('./commands/generate'),
  create = require('./commands/create');

function err(e){
  console.log(chalk.red('Error happened :('));
  console.log(e.message);
  console.log(chalk.yellow('---------------'));

  // var stack = new Error().stack;
  // console.log(stack);
}

var commands = {
  setup: function(enchup, options){
    try {
      setup(enchup, options);
    } catch (e){
      err(e);
    }
  },

  info: function(){
    try {
      info();
    } catch (e){
      err(e);
    }
  },

  generate: function(options){
//    var result;
//
//    if (options.hasOwnProperty('info') && options.info){
//      result = generate
//        .info()
//        .catch(err);
//    } else {
//       result = generate
//        .run()
//        .catch(err);
//    }
//
//    return result;
  },

  create: function(component, name, template, options){
    try {
      create(component, name, template, options);
    } catch (e){
      err(e);
    }
  }
};

module.exports = commands;