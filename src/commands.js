"use strict";

var chalk = require('chalk'),
  path = require('path'),
  $q = require('q'),

  clone = require('./clone'),
  config = require('./config'),
  plugins = require('./plugins'),
  create = require('./create');

function err(e){
  console.log(chalk.red(chalk.underline('Error')));
  console.log(chalk.red(e.message));
}

var commands = {
  setup: function(dir, skeleton, options){

    if (!dir){
      dir = '.';
    }

    dir = path.join(dir, 'eva');

    if (!skeleton){
      skeleton = 'tuchk4/eva-skeleton';
    }

    clone(dir, skeleton, options)
      .then(function(){
        commands.plugins(dir);
      })
      .catch(err);
  },

  create: function(component, parameters, template, options){

    create('eva', component, parameters, template, options)
      .catch(err);
  },


  plugins: function(){

    var dir = path.join('.', 'eva');
    var structure = config.get(dir);

    config.info(dir);

    plugins.generate(dir, structure)
      .catch(err);
  },

  info: function(){

    var dir = path.join('.', 'eva');
    var skeleton = config.get(dir);

    plugins.info(dir, skeleton);
  }
};

module.exports = commands;