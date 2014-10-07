'use strict';

var Command = require('../command'),
  fs = require('fs'),
  exists = require('fs').existsSync,
  read = require('fs').readFileSync,
  normalize = require('path').normalize,
  dirname = require('path').dirname,
  join = require('path').join,
  extname = require('path').extname,
  Types = require('../../utils/types'),
  chalk = require('chalk'),
  Y = chalk.yellow,
  log = function (m) {
    console.log(Y(m));
  },
  Create = Command.extend({

    initialize: function () {
      this.initPromise();
    },

    isContinue: function(){
      return !!this.options.continue;
    },

    setComponent: function (component) {
      this.component = component;
    },

    setName: function (name) {
      this.name = name;
      this.keys = this.name.split(':');
    },

    setTemplate: function (template) {
      this.template = template;
    },

    exec: function () {
      return this.flow()
        .then(this.prepare.bind(this))
        .then(this.create.bind(this));
    },

    prepare: function () {

      return {
        path: this.getPath(this.component)
      }
    },

    getPath: function (component) {
      var components = this.config.app.components;

      if (!components.hasOwnProperty(component)) {
        throw new Error('Component "' + component + '" does not exist');
      }

      return  components[component];
    },

    getComponentExtension: function (component) {
      var path = this.getPath(component || this.component);
      return extname(path);
    },

    create: function (config) {
      if (!Types.isArray(config.path)) {
        config.path = [config.path];
      }

      var queue = [],
        i, size;

      for (i = 0, size = config.path.length; i < size; i++) {
        var path = config.path[i],
          parsed = this.parse(path),
          placeholders = this.getPlaceholders(parsed),
          replaced = this.replace(parsed, placeholders);

        queue.push({
          path: replaced,
          placeholders: placeholders
        });
      }

      var existing = this.exists(queue);

      if (!!existing.length && !this.isContinue()){
        if (this.isForce()){
          this.clean(existing);
        } else {
          throw new Error('File exists. Use -f to override');
        }
      }

      for (i = 0, size = queue.length; i < size; i++){
        var template = this.getTemplate(),
          compiled = this.compile(template, queue[i].placeholders);

        log(queue[i].path);
        log(compiled);
       }
    },

    clean: function(files){
      for (var i = 0, size = files.length; i < size; i++){
        rimraf.sync(files[i]);
      }
    },

    exists: function(queue){
      var existing = [];

      for (var i = 0, size = queue.length; i < size; i++){
        if (exists(queue[i].path)){
          existing.push(queue[i].path);
        }
      }

      return existing;
    },

    compile: function (template, placeholders) {

      var expr, value;

      for (var i = 0, size = placeholders.length; i < size; i++) {
        var placeholder = placeholders[i].placeholder.slice(1);

        value = placeholders[i].value;
        expr = new RegExp('{{\\s*' +  placeholder + '\\s*}}', 'g');

        template = template.replace(expr, value);
      }

      var parameters = this.config.app.parameters || {};

      for (var param in parameters){
        if (parameters.hasOwnProperty(param)){

          value = parameters[param];
          expr = new RegExp('{{\\s*' +  param + '\\s*}}', 'g');

          template = template.replace(expr, value);
        }
      }

      return template;
    },

    getTemplate: function () {
      var extension = this.getComponentExtension(),
        template = 'default',
        dir = this.config.template_dir;

      if (!!this.template) {
        template = this.template;
      }

      template += extension;

      var appTemplate = join(dir, 'app', this.component, template),
        repoTemplate = join(dir, 'repo', this.component, template),
        path;

      if (exists(appTemplate)) {
        path = appTemplate;
      } else if (exists(repoTemplate)) {
        path = repoTemplate;
      }

      var source = '';

      if (!!path) {
        source = read(path, 'utf8');
      }

      return source;
    },

    replace: function (path, placeholders) {

      for (var i = 0, size = placeholders.length; i < size; i++) {
        var expr = new RegExp(placeholders[i].placeholder, 'g'),
          value = placeholders[i].value;

        path = path.replace(expr, value);
      }

      return path;
    },

    getPlaceholders: function (path) {
      var placeholders = path.match(/(:[^\/|\\|:|\-|\.]+)/g).filter(function (value, index, self) {
        return self.indexOf(value) === index
      });

      if (this.keys.length != placeholders.length) {
        throw new Error('Placeholders and input parameters are wrong');
      }

      var result = [];
      for (var i = 0, size = placeholders.length; i < size; i++) {
        result.push({
          placeholder: placeholders[i],
          value: this.keys[i]
        });
      }

      return result;
    },

    parse: function (path) {

      var placeholders = path.match(/(\^[^\/|:|-]+:?)/g),
        parsed = path;

      if (Types.isArray(placeholders)) {
        if (placeholders.length === 1) {
          var key = placeholders[0],
            dependency = key.slice(1),
            depPath = this.getPath(dependency);


          if (Types.isArray(depPath)) {
            throw new Error('Dep path could not be array');
          }

          var depPathParsed = this.parse(depPath),
            depDirectory = this.dirname(depPathParsed);

          parsed = parsed.replace(key, depDirectory);
        } else {
          throw new Error('Wrong path definitions. Dep path (^) could be only one');
        }
      }

      return normalize(parsed);
    },

    dirname: function (path) {
      var dir = path;

      if (!!extname(path)) {
        dir = dirname(path);
      }

      return dir;
    }
  });


module.exports = Create;