"use strict";


var Boop = require('boop'),
  exists = require('fs').existsSync,
  read = require('fs').readFileSync,
  move = require('fs').renameSync,
  writeStream = require('fs').createWriteStream,
  readStream = require('fs').createReadStream,
  extname = require('path').extname,


  join = require('path').join;

var Tree = Boop.extend({
  initialize: function (dist, tree) {
    this.tree = tree;
    this.files = [];
    this.dist = dist;

    this.parse();
  },

  parse: function () {
    for (var i = 0, size = this.tree.length; i < size; i++) {
      var file = this.tree[i],
        path = this.getSrcPath(file);

      if (!exists(path)) {
        throw new Error('Tree: File does not exists: "' + path + '"');
      }

      var namespace = this.getNamespace(file),
        dist = this.getDistPath(file);

      this.files[namespace] = {
        ext: extname(file),
        src: path,
        dist: dist,
        processed: false
      };
    }
  },

  getSrcPath: function (path) {
    return join('.', path);
  },

  getDistPath: function(path){
    return join('.', this.dist, path);
  },

  getNamespace: function (path) {

    return path.replace(/\//g, '.');
  },

  get: function (namespace) {
    if (!this.files.hasOwnProperty(namespace)) {
      throw new Error('File for this namespace does not exists');
    }

    return this.files[namespace];
  },

  read: function (namespace) {
    var file = this.get(namespace);

    return read(file.src, 'utf-8');
  },

  each: function (expr) {

    for (var namespace in this.files) {
      if (this.files.hasOwnProperty(namespace)) {
        expr(namespace, this.files[namespace]);
      }
    }
  },

  copy: function (namespace) {
    var item = this.get(namespace);

    readStream(item.src)
      .pipe(writeStream(item.dist));
  }
});


module.exports = Tree;

