'use strict';

var Boop = require('boop'),
  exists = require('fs').existsSync,
  write = require('fs').writeFileSync,
  mkdir = require('mkdirp'),
  dirname = require('path').dirname,
  rimraf = require('rimraf');

var Component = Boop.extend({
  initialize: function (name) {
    this.name = name;
  },

  setTemplate: function (template) {
    this.template = template;
  },

  setSource: function (source) {
    this.source = source;
  },


  setPath: function (path) {
    this.path = path;
  },

  setPlaceholders: function (placeholders) {
    this.placeholders = placeholders;
  },

  save: function () {
    var dir = dirname(this.path);

    if (!exists(dir)) {
      if (mkdir.sync(dir) === null) {
        throw new Error('Could not create dir for component');
      }
    }

    return write(this.path, this.source);
  },

  exists: function () {
    return exists(this.path);
  },

  remove: function () {
    rimraf.sync(this.path);
  }
});


module.exports = Component;