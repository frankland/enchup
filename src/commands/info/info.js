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
        var Schema = new SchemaClass(this.config.app_config.components);

        var components = this.config.app_config.components;

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


      if (!config.hasOwnProperty('app_config')){
        throw new Error('Info: App config does not exists');
      }

      if (config.app_config.hasOwnProperty('name')) {
        console.log(config.app_config.name);
      }

      if (config.app_config.hasOwnProperty('author')) {
        console.log(config.app_config.author);
      }

      if (config.app_config.hasOwnProperty('version')) {
        console.log(config.app_config.version);
      }

      if (config.app_config.hasOwnProperty('description')) {
        console.log(config.app_config.description);
      }

      if (config.app_config.hasOwnProperty('readme')) {
        console.log(config.app_config.readme);
      }
    }
  });


module.exports = Info;
