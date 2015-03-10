'use strict';

var Boop = require('boop'),
    join = require('path').join,
    read = require('fs').readFileSync,
    exists = require('fs').existsSync,
    extname = require('path').extname,
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

  path: function(Component) {
    var template = Component.template || 'default',
        dir = this.config.template_dir;

    //template += extname(Component.path);
    template += '.hbs';


    var appTemplate = join(dir, 'app', Component.name, template),
        repoTemplate = join(dir, 'repo', Component.name, template),
        path;


    if (exists(appTemplate)) {
      path = appTemplate;
    } else if (exists(repoTemplate)) {
      path = repoTemplate;
    }

    return path;
  },


  get: function(Component) {

    var source = '',
        path = this.path(Component);

    if (!!path) {
      source = read(path, 'utf8');
    }

    return source;
  }
});


module.exports = Templates;
