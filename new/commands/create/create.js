'use strict';

var Command = require('../command'),
  fs = require('fs'),
  join = require('path').join,
  Types = require('../../utils/types'),
  Chalk = require('chalk'),
  SchemaClass = require('./schema'),
  TemplateClass = require('./templates'),
  ComponentClass = require('./component'),
  Placeholders = require('./placeholders'),
  Create = Command.extend({

    initialize: function () {
      this.initPromise();
    },

    isContinue: function () {
      return !!this.options.continue;
    },

    setComponent: function (component) {
      this.component = component;
    },

    setParameters: function (parameters) {
      this.parameters = parameters;
    },

    setTemplate: function (template) {
      this.template = template;
    },

    getComponentConfig: function (component) {
      var config = this.Schema.get(component, true),
        map,
        result = {};


      result.components = {};
      if (Types.isString(config)) {
        //result.map = Placeholders.map(map, this.parameters);

        var path = this.Schema.resolve(component);
        map = Placeholders.parse(path);

        result.components[this.component] = {
          path: path,
          template: this.template
        }
      } else if (Types.isObject(config)) {

        if (!config.hasOwnProperty('map') || !config.hasOwnProperty('components')) {
          throw new Error('For complex components "map" and "components" should be defined');
        }

        map = config.map.split(':');
        result.map = Placeholders.map(map, this.parameters);

        var components = config.components;
        for (var name in components) {
          if (components.hasOwnProperty(name)) {
            result.components[name] = {
              path: this.Schema.resolve(name),
              template: components[name]
            }
          }
        }
      } else {
        throw new Error('Component config could be only string or object');
      }


      return result;
    },

    placeholders: function () {
      var config = this.Schema.get(this.component, true),
        map;

      if (Types.isString(config)) {
        var path = this.Schema.resolve(this.component);
        map = Placeholders.parse(path);

      } else if (Types.isObject(config)) {
        map = config.map.split(':');
      }

      return Placeholders.map(map, this.parameters);
    },

    components: function (placeholders) {
      var config = this.Schema.get(this.component, true),
        components = {};

      if (Types.isString(config)) {
        components[this.component] = {
          path: this.Schema.compile(this.component, placeholders),
          template: this.template
        };

      } else if (Types.isObject(config)) {

        for (var name in config.components) {
          if (config.components.hasOwnProperty(name)) {
            components[name] = {
              path: this.Schema.compile(name, placeholders),
              template: config.components[name]
            }
          }
        }
      }

      return {
        placeholders: placeholders,
        components: components
      }
    },

    merge: function (config) {
      var parameters = config.placeholders;

      if (this.config.app.parameters) {
        for (var key in this.config.app.parameters) {
          if (this.config.app.parameters.hasOwnProperty(key)) {
            parameters[key] = this.config.app.parameters[key];
          }
        }
      }

      config.parameters = parameters;

      return config;
    },


    exec: function () {
      this.Schema = new SchemaClass(this.config.app.components);
      this.Template = new TemplateClass(this.config);

      if (this.isForce() && this.isContinue()) {
        throw new Error('Force and Continue flags could not be used at same time');
      }

      return this.flow()
        .then(this.placeholders.bind(this))
        .then(this.components.bind(this))
        .then(this.merge.bind(this))
        .then(this.create.bind(this));
    },

    prepare: function () {
      return  this.getComponentConfig(this.component);
    },

    create: function (config) {
      var components = config.components,
        parameters = config.parameters;

      for (var name in  components) {
        if (components.hasOwnProperty(name)) {

          var local = components[name],
            Component = new ComponentClass(name);

          Component.setTemplate(local.template);
          Component.setPath(local.path);

          var template = this.Template.compile(Component, parameters),
            ok = false;

          Component.setSource(template);

          if (Component.exists()) {
            if (this.isForce()) {
              Component.remove();
              ok = true;
            } else if (!this.isContinue()){
              throw new Error('You should describe force or continue flag for existing files');
            }
          } else {
            ok = true;
          }

          if (ok){
            Component.save();
            this.log(Component);
          }
        }
      }
    },

    log: function(Component){
      var y = Chalk.cyan,
        u = Chalk.white.underline,
        b = Chalk.blue,
        log = console.log,
        template = Component.template,
        templatePath = this.Template.path(Component);

      if (!template) {
        if (!Component.source.length){
          template = 'empty';
        } else {
          template = 'default';
        }
      }

      log(b('+---'));
      log(b('|   ') + y('Component created:') + ' ' + u(Component.name) + ' ' + y('at path:') + ' ' + u(Component.path));

      if (!!templatePath){
        log(b('|   ') +y('Using') + ' ' + u(template) + ' ' + y('template') + ' ' + y('at:') + ' ' + u(templatePath));
      } else {
        log(b('|   ') + y('Created without template because template was not found'));
      }
      log(b('+---'));
    }
  });

module.exports = Create;