'use strict';


var Command = require('../command'),
    path = require('path'),
    prettyjson = require('prettyjson'),
    Chalk = require('chalk'),
    Types = require('../../utils/types'),
    Table = require('cli-table'),
    Placeholders = require('../create/placeholders'),
    SchemaClass = require('../create/schema'),
    RandomWords = require('../../utils/random-words'),
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
            .then(this.detailed.bind(this))
            .then(this.example.bind(this));
      },

      highlite: function(path) {
        return path.replace(/(:[^-|\/|\.]+)/g, Chalk.green('$1'));
      },

      example: function() {

        if (this.component) {
          var name = this.component;
          var parameters = null;

          var Schema = new SchemaClass(this.config.app_config.components, this.config.app_config.base);
          var component = Schema.get(this.component);

          if (Types.isString(component)) {

            var path = Schema.resolve(this.component);
            parameters = Placeholders.parse(path);
          } else if (Types.isObject(component)) {

            if (component.map) {
              parameters = component.map.split(':');
            }
          }

          var example = 'enchup create ';

          example += name + ' ';

          var parametersLength = parameters.length;
          var exampleParameters = [];
          var associative = {};

          var Words = new RandomWords();
          for (var i = 0; i < parametersLength; i++) {
            var key = Words.next();

            exampleParameters.push(key);
            associative[parameters[i]] = key;
          }

          example += exampleParameters.join(':');

          console.log('');
          console.log('Example for creating "' + name +'" component:');
          console.log('');
          console.log('$ > ' + Chalk.blue(example));
          console.log('');
          console.log('In this case parameters mapping will be:');
          console.log('');
          console.log(prettyjson.render(associative));
        }
      },

      detailed: function() {
        if (this.component) {
          var Schema = new SchemaClass(this.config.app_config.components, this.config.app_config.base);

          var component = Schema.get(this.component);

          var data = [];
          var provide = [];
          var dependencies = [];

          if (Types.isString(component)) {
            data.push({component: Chalk.cyan(this.component)});

            var path = Schema.resolve(this.component);
            var map = Placeholders.parse(path);

            if (map) {
              data.push({parameters: map.join(':')});
            }

            data.push({path: this.highlite(path)});
          } else if (Types.isObject(component)) {
            data.push({component: Chalk.cyan(this.component)});

            if (component.map) {
              data.push({parameters: component.map});
            }

            if (component.template) {
              data.push({template: component.template});
            }

            if (component.path) {
              data.push({path: Schema.resolve(this.component)});
            }

            if (Types.isObject(component.provide)) {
              for (var placeholder in component.provide) {
                if (component.provide.hasOwnProperty(placeholder)) {
                  var value = component.provide[placeholder];

                  if (value[0] == ':') {
                    provide.push([Chalk.green(':' + placeholder), 'equals to ' + Chalk.green(':' + value.slice(1))]);
                  } else {
                    provide.push([placeholder, value]);
                  }
                }
              }
            }

            if (Types.isArray(component.components)){
              for (var i = 0, size = component.components.length; i < size; i++) {
                var item = component.components[i].split(':'),
                    name = item[0],
                    template = item[1] || item[0];


                var path = Schema.resolve(name);

                dependencies.push([Chalk.yellow(name), this.highlite(path), template + '.hbs']);
              }
            }
          }


          var innerTableChars = {
            'top': '' ,
            'top-mid': '' ,
            'top-left': '' ,
            'top-right': '',
            'bottom': '' ,
            'bottom-mid': '' ,
            'bottom-left': '' ,
            'bottom-right': '',
            'left': '' ,
            'left-mid': '' ,
            'mid': '─' ,
            'mid-mid': '',
            'right': '' ,
            'right-mid': '' ,
            'middle': '│'
          };


          if (provide.length) {
            var provideTable = new Table({
              chars: innerTableChars
            });
            provideTable.push.apply(provideTable, provide);
            data.push({provide: provideTable.toString()});
          }

          if (dependencies.length) {
            var depsTable = new Table({
              head: ['Component', 'Path', 'Template'],
              chars: innerTableChars
            });
            depsTable.push.apply(depsTable, dependencies);
            data.push({'components': depsTable.toString()});
          }

          var table = new Table();
          table.push.apply(table, data);

          console.log('');
          console.log('');

          //if (!data.hasOwnProperty('path') && (!data.hasOwnProperty('parameters') || !data.hasOwnProperty('provide'))) {
          //  console.log(Chalk.red('Warning: @path and @parameters or @provide options should be described. ' +
          //  'Otherwise - enchup will not be able to compile component paths and template.'));
          //}

          console.log(table.toString());
        }
      },

      info: function() {

        var app = this.config.app_config || {};
        var user = this.config.user_config || {};

        var infoBlock = {
          parameters: app.parameters || {},
          user: user
        };

        console.log(prettyjson.render(infoBlock));
        console.log('');
        console.log(prettyjson.render({
          components: Object.keys(app.components)
        }));
      }
    });


module.exports = Info;
