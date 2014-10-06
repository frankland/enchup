'use strict';

var Command = require('../command'),
  path = require('path'),
  Types = require('../../utils/types'),
  Create = Command.extend({

    initialize: function () {
      this.initPromise();
    },

    setComponent: function(component){
      this.component = component;
      this.keys = this.component.split(':');
    },

    setName: function(name){
      this.name = name;
    },

    setTemplate: function(template){
      this.template = template;
    },

    exec: function () {
      return this.flow()
        .then(this.prepare.bind(this))
        .then(this.create.bind(this));
    },

    prepare: function(){
      var components = this.config.app.components;

      if (!components.hasOwnProperty(this.component)){
        throw new Error('Component "' + this.component + '" does not exist');
      }

      return {
        path: components[this.component]
      }
    },

    create: function(config){
      if (!Types.isArray(config.path)){
        config.path = [config.path];
      }

      console.log(config.path);

      for (var i = 0, size = config.path.length; i < size; i++){

      }
    }
  });


module.exports = Create;