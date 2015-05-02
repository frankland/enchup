'use strict';

var Command = require('../command'),
    exists = require('fs').existsSync,
    join = require('path').join,
    Types = require('../../utils/types'),
    Chalk = require('chalk'),
    SchemaClass = require('./schema'),
    TemplateClass = require('./templates'),
    ComponentClass = require('./component'),
    Placeholders = require('./placeholders'),
    Table = require('cli-table'),
    Create = Command.extend({

      initialize: function() {
        this.initPromise();
      },

      exec: function() {

        if (this.isForce() && this.isContinue()) {
          throw new Error('Force and Continue flags could not be used at same time');
        }

        return this.flow()
            .then(this.validate.bind(this))
            .then(this.prepare.bind(this))
            .then(this.placeholders.bind(this))
            .then(this.components.bind(this))
            .then(this.merge.bind(this))
            .then(this.create.bind(this));
      },

      prepare: function() {
        this.Schema = new SchemaClass(this.config.app_config.components, this.config.app_config.base);
        this.Template = new TemplateClass(this.config);
      },

      isContinue: function() {
        return !!this.options.continue;
      },

      setComponent: function(component) {
        this.component = component
      },

      setParameters: function(parameters) {
        this.parameters = parameters;
      },

      setTemplate: function(template) {
        this.template = template;
      },

      placeholders: function() {
        var config = this.Schema.get(this.component, true),
            map,
            provide = {};

        if (Types.isString(config)) {
          var path = this.Schema.resolve(this.component);
          map = Placeholders.parse(path);

        } else if (Types.isObject(config)) {
          map = config.map.split(':');

          if (config.hasOwnProperty('provide')) {
            provide = config.provide;
          }
        }

        if (Placeholders.isValid(this.parameters)) {
          throw new Error('Parameters is not valid');
        }

        var placeholders = Placeholders.map(map, this.parameters);

        for (var item in provide) {
          if (provide.hasOwnProperty(item)) {
            var value = provide[item];
            if (value[0] == ':') {
              value = placeholders[value.slice(1)];
            }

            placeholders[item] = value;
          }
        }

        return placeholders;
      },

      components: function(placeholders) {
        var config = this.Schema.get(this.component, true),
            components = {};

        if (Types.isString(config)) {
          components[this.component] = {
            path: this.Schema.compile(this.component, placeholders),
            template: this.template
          };

        } else if (Types.isObject(config)) {

          if (config.hasOwnProperty('path')) {
            components[this.component] = {
              path: this.Schema.compile(this.component, placeholders),
              template: this.template || config.template
            }
          }

          if (config.hasOwnProperty('components')) {
            for (var i = 0, size = config.components.length; i < size; i++) {
              var component = config.components[i].split(':'),
                  name = component[0],
                  template = component[1];

              components[name] = {
                path: this.Schema.compile(name, placeholders),
                template: template
              }
            }
          }
        }

        return {
          placeholders: placeholders,
          components: components
        }
      },

      merge: function(config) {
        var parameters = {},
            key;

        for (key in config.placeholders) {
          if (config.placeholders.hasOwnProperty(key)) {
            parameters[key] = config.placeholders[key];
          }
        }

        if (this.config.app_config.parameters) {
          for (key in this.config.app_config.parameters) {
            if (this.config.app_config.parameters.hasOwnProperty(key)) {
              parameters[key] = this.config.app_config.parameters[key];
            }
          }
        }

        if (this.config.user_config) {
          for (key in this.config.user_config) {
            if (this.config.user_config.hasOwnProperty(key)) {
              parameters[key] = this.config.user_config[key];
            }
          }
        }


        parameters.date = new Date()
            .toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '');

        config.parameters = parameters;

        return config;
      },


      create: function(config) {
        var components = config.components,
            parameters = config.parameters,
            created = [];

        for (var name in components) {
          if (components.hasOwnProperty(name)) {

            var local = components[name],
                Component = new ComponentClass(name);

            Component.setTemplate(local.template);
            Component.setPath(local.path);

            var script = join(this.config.scripts, Component.name + '.js');

            if (exists(script)) {
              Component.setPostScript(script);
            }

            var template = this.Template.compile(Component, parameters),
                ok = false;

            Component.setSource(template);

            if (Component.exists()) {
              if (this.isForce()) {
                Component.remove();
                ok = true;
              } else if (!this.isContinue()) {
                throw new Error('You should use force (-f) or continue (-c) flag for existing files');
              }
            } else {
              ok = true;
            }

            if (ok) {
              //Component.save();
              created.push(Component);
            }
          }
        }

        // save components after loop to prevent errors with -c --continue flags
        // make create command is atomic
        for (var i = 0, size = created.length; i < size; i++) {
          created[i].save();
        }

        this.log(created);
      },


      log: function(components) {
        var table = new Table();

        for (var i = 0, size = components.length; i < size; i++) {
          var Component = components[i];

          var template = this.Template.path(Component) || 'empty';

          table.push([
            Chalk.cyan(Component.name),
            Component.path,
            template.replace(/([^\/]+)\.hbs/, Chalk.green('$1') + '.hbs')
          ]);
        }


        console.log(table.toString());
      }
    });

module.exports = Create;
