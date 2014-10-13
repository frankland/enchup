'use strict';

var Boop = require('boop'),
  join = require('path').join,
  read = require('fs').readFileSync,
  exists = require('fs').existsSync,
  extname = require('path').extname;

var Templates = Boop.extend({
  initialize: function (config) {
    this.config = config;
  },

  compile: function (Component, parameters) {

    var template = this.get(Component);

    for (var param in parameters) {
      if (parameters.hasOwnProperty(param)) {
        var value = parameters[param],
          expr = new RegExp('{{\\s*' + param + '\\s*}}', 'g');

        template = template.replace(expr, value);
      }
    }

    return template;
  },

  get: function (Component) {
    var template = Component.template || 'default',
      dir = this.config.template_dir;

    template += extname(Component.path);


    var appTemplate = join(dir, 'app', Component.name, template),
      repoTemplate = join(dir, 'repo', Component.name, template),
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
  }
});


module.exports = Templates;
