'use strict';

var Boop = require('boop'),
  extname = require('path').extname,
  dirname = require('path').dirname,
  normalize = require('path').normalize,
  Types = require('../../utils/types'),
  Placeholders = require('./placeholders');

var Schema = Boop.extend({
  initialize: function (components) {
    this.components = components;
  },

  get: function (component, ex) {
    if (!this.components.hasOwnProperty(component)) {
      throw new Error('Component "' + component + '" does not exist');
    }

    var path = this.components[component];

    if (!Types.isString(path) && !ex) {
      throw new Error('Component "' + component + '" is described as chain');
    }

    return path;
  },

  compile: function(component, replacement){

    var resolved = this.resolve(component),
      placeholders = Placeholders.parse(resolved),
      keys = Object.keys(replacement);

    for (var i = 0, size = placeholders.length; i < size; i++){
      if (keys.indexOf(placeholders[i]) == -1){
        throw new Error('Placeholder "' + placeholders[i] + '" is not described');
      }
    }

    for (var key in replacement){
      if (replacement.hasOwnProperty(key)){
        var expr = new RegExp(':' + key, 'g');
        resolved = resolved.replace(expr, replacement[key]);
      }
    }

    return resolved;
  },


  resolve: function (component) {
    var path = this.get(component),
      placeholders = Placeholders.dependency(path),
      parsed = path;

    if (Types.isArray(placeholders)) {
      if (placeholders.length === 1) {
        var key = placeholders[0],
          dependency = key.slice(1);

        var depPathParsed = this.resolve(dependency),
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


module.exports = Schema;
