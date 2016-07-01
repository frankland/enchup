'use strict';

var Boop = require('boop'),
    join = require('path').join,
    read = require('fs').readFileSync,
    exists = require('fs').existsSync,
    //extname = require('path').extname,
    Handlebars = require('../../utils/handlebars');

var Templates = Boop.extend({
  initialize: function(config) {
    this.config = config;
  },

  compile: function(Component, parameters) {

    var template = this.get(Component);
    var compile = Handlebars.compile(template);

    return compile(parameters);
  },


  exists: function(name, template) {
    var path = this.path(name, template);

    return exists(path);
  },

  path: function(name, template) {
    var resolved = (template || name) + '.hbs';
    var dir = this.config.template_dir;

    //var appTemplate = join(dir, 'app', Component.name, template),
    //    repoTemplate = join(dir, 'repo', Component.name, template),
    //    path;


    //if (exists(appTemplate)) {
    //  path = appTemplate;
    //} else if (exists(repoTemplate)) {
    //  path = repoTemplate;
    //}


    return join(dir, resolved);
  },


  get: function(Component) {
    var source = '';

    if (!!this.exists(Component.name, Component.template)) {
      var path = this.path(Component.name, Component.template);
      source = read(path, 'utf8');
    }

    return source;
  }
});


module.exports = Templates;
