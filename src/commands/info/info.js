'use strict';

var Command = require('../command'),
    path = require('path'),
    prettyjson = require('prettyjson'),
    Chalk = require('chalk'),
    Types = require('../../utils/types'),
    Table = require('cli-table'),
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

      highlite: function(path) {
        return path.replace(/(:[^-|\/|\.]+)/g, Chalk.green('$1'));
      },

      detailed: function() {
        if (this.component) {
          var Schema = new SchemaClass(this.config.app_config.components, this.config.app_config.base);

          var component = Schema.get(this.component);

          var data = [];
          var provide = [];
          var dependencies = [];

          if (Types.isString(component)) {
            var name = this.component;
            data.push({component: Chalk.cyan(name)});

            var path = Schema.resolve(this.component);
            var map = Placeholders.parse(path);

            if (map) {
              data.push({parameters: map.join(':')});
            }

            data.push({path: this.highlite(path)});
          } else if (Types.isObject(component)) {

            data.push({component: this.component});

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
                    template = item[1] || 'default';

                var path = Schema.resolve(name);

                dependencies.push([Chalk.yellow(name), this.highlite(path), template]);
              }
            }
          }


          var innerTableChars = {
            chars: {
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
            }
          };


          if (provide.length) {
            var provideTable = new Table(innerTableChars);
            provideTable.push.apply(provideTable, provide);
            data.push({provide: provideTable.toString()});
          }

          if (dependencies.length) {
            var depsTable = new Table(innerTableChars);
            depsTable.push.apply(depsTable, dependencies);
            data.push({'component list': depsTable.toString()});
          }

          var table = new Table();
          table.push.apply(table, data);

          console.log('');
          console.log('');

          if (!data.hasOwnProperty('map') && !data.hasOwnProperty('provide')) {
            console.log(Chalk.red('Warning: @map or @provide should be described. ' +
            'Otherwise - enchup will not be able to compile component paths and template'));
          }


          console.log(table.toString());
        }
      },

      info: function() {

        var app = this.config.app_config || {};
        var user = this.config.user_config || {};

        var infoBlock = {
          author: {
            app: app.author,
            user: user.author
          },
          application: app.application,
          version: app.version
        };

        console.log(prettyjson.render(infoBlock));
        console.log('');
        console.log(prettyjson.render({
          components: Object.keys(app.components)
        }));
      }
    });


module.exports = Info;
