'use strict';

var Command = require('../command'),
    path = require('path'),
    Chalk = require('chalk'),
    Types = require('../../utils/types'),
    Placeholders = require('../create/placeholders'),
    SchemaClass = require('../create/schema'),
    Info = Command.extend({

      initialize: function() {
        this.initPromise();
      },

      setComponent: function(component) {
        this.component = component;
      },

      exec: function() {

        return this.flow()
            .then(this.validate.bind(this))
            .then(this.info.bind(this))
            .then(this.detailed.bind(this));
      },

      detailed: function() {
        if (this.component) {
          var Schema = new SchemaClass(this.config.app_config.components);

          var components = this.config.app_config.components;

          if (!components.hasOwnProperty(this.component)) {
            throw new Error('Component "' + this.component + '" does not exists');
          }

          var component = components[this.component];

          console.log('');
          console.log(Chalk.blue('+--------------'));
          if (Types.isString(component)) {

            console.log(Chalk.green(Placeholders.parse(component).join(':')));
            console.log(Chalk.blue(Schema.resolve(this.component)));

          } else if (Types.isObject(component)) {

            console.log('| component: ' + Chalk.cyan(this.component));
            console.log('| parameters map: ' + Chalk.green(component.map));


            if (Types.isObject(component.provide)) {
              console.log('| ');
              console.log('| provided placeholders:');

              for (var placeholder in component.provide) {
                if (component.provide.hasOwnProperty(placeholder)) {
                  var value = component.provide[placeholder];

                  if (value[0] == ':') {
                    console.log('|  - ' + Chalk.yellow(placeholder) + ' value will equal to ' + Chalk.green(value.slice(1)));
                  } else {
                    console.log('|  - ' + Chalk.yellow(placeholder) + ' = ' + value);
                  }
                }
              }
            }


            console.log('| ');
            console.log('| will be created: ');

            for (var item in component.components) {
              console.log('|  - ' + Chalk.green(item) + ' using ' + Chalk.underline(component.components[item] || 'default') + ' template');
            }
          }

          console.log(Chalk.yellow('+--------------'));
          console.log('');
        }
      },

      info: function() {

        var config = this.config;

        if (config.app_config.hasOwnProperty('name')) {
          console.log('name: ' + config.app_config.name);
        }

        if (config.app_config.hasOwnProperty('author')) {
          console.log('author: ' + config.app_config.author);
        }

        if (config.app_config.hasOwnProperty('version')) {
          console.log('version: ' + config.app_config.version);
        }

        if (config.app_config.hasOwnProperty('description')) {
          console.log('description: ' + config.app_config.description);
        }

        if (config.app_config.hasOwnProperty('readme')) {
          console.log('readme: ' + config.app_config.readme);
        }
      }
    });


module.exports = Info;
