'use strict';

var Boop = require('boop'),
    Config = require('../../config'),
    extname = require('path').extname,
    dirname = require('path').dirname,
    normalize = require('path').normalize,
    Types = require('../../utils/types'),
    Placeholders = require('./placeholders');

var Schema = Boop.extend({
  initialize: function(components, base) {
    this.components = components;
    this.base = base || '';
  },

  get: function(component) {
    if (!this.components.hasOwnProperty(component)) {
      throw new Error('Component "' + component + '" does not exist');
    }

    return this.components[component];
  },

  path: function(name) {
    var component = this.get(name),
        path = component;


    if (Types.isObject(component)) {
      path = component.path;
    }

    if (!path) {
      throw new Error('Path for "' + component + '" is not described');
    }

    return path;
  },


  compile: function(component, replacement) {
    var resolved = this.resolve(component),
        placeholders = Placeholders.parse(resolved),
        keys = Object.keys(replacement);

    for (var i = 0, size = placeholders.length; i < size; i++) {
      if (keys.indexOf(placeholders[i]) == -1) {
        throw new Error('Placeholder "' + placeholders[i] + '" is not described');
      }
    }

    for (var key in replacement) {
      if (replacement.hasOwnProperty(key)) {
        var expr = new RegExp(':' + key, 'g');
        resolved = resolved.replace(expr, replacement[key]);
      }
    }

    return resolved;
  },


  resolve: function(component) {
    return normalize(this.base + this.path(component));
  },

  dirname: function(path) {
    var dir = path;

    if (!!extname(path)) {
      dir = dirname(path);
    }

    return dir;
  }
});


module.exports = Schema;
