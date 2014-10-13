'use strict';

var Command = require('../command'),
  path = require('path'),
  Chalk = require('chalk'),
  Types = require('../../utils/types'),
  Placeholders = require('../create/placeholders'),
  SchemaClass = require('../create/schema'),
  Info = Command.extend({

    initialize: function () {
      this.initPromise();
    },

    setComponent: function(component){
      this.component = component;
    },

    exec: function () {

      return this.flow()
        .then(this.info.bind(this))
        .then(this.detailed.bind(this));
    },

    detailed: function(){
      if (this.component){
        var Schema = new SchemaClass(this.config.app.components);

        var components = this.config.app.components;

        if (!components.hasOwnProperty(this.component)){
          throw new Error('Component does not exists');
        }

        var component = components[this.component];

        if (Types.isString(component)){

          console.log(Chalk.green(Placeholders.parse(component).join(':')));
          console.log(Chalk.blue(Schema.resolve(this.component)));
        } else if (Types.isObject(component)){
          console.log(Chalk.green(component.map));
          for (var item in component.components){
            console.log(Chalk.blue(item + ' -> ' + component.components[item]));
          }
        }
      }
    },

    info: function () {
      var config = this.config;

      if (!config.hasOwnProperty('app')){
        throw new Error('App config does not exists');
      }

      if (config.app.hasOwnProperty('name')) {
        console.log(config.app.name);
      }

      if (config.app.hasOwnProperty('author')) {
        console.log(config.app.author);
      }

      if (config.app.hasOwnProperty('version')) {
        console.log(config.app.version);
      }

      if (config.app.hasOwnProperty('description')) {
        console.log(config.app.description);
      }

      if (config.app.hasOwnProperty('readme')) {
        console.log(config.app.readme);
      }
    }
  });


module.exports = Info;