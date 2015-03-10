'use strict';

var Boop = require('boop'),
    exists = require('fs').existsSync,
    write = require('fs').writeFileSync,
    read = require('fs').readFileSync,
    mkdir = require('mkdirp').sync,
    dirname = require('path').dirname,
    normalize = require('path').normalize,
    join = require('path').join,
    fs = require('fs'),
    //vm = require('vm'),
    rimraf = require('rimraf');

var Component = Boop.extend({
  initialize: function(name) {
    this.name = name;
  },

  setTemplate: function(template) {
    this.template = template;
  },

  setSource: function(source) {
    this.source = source;
  },

  setPostScript: function(script) {
    this.script = script;
  },

  setPath: function(path) {
    this.path = path;
  },

  save: function() {
    /**
     * TODO: refact normalize function
     */
    var path = normalize(join('./', this.path)),
        dir = dirname(path);

    if (!exists(dir)) {
      if (mkdir(dir) === null) {
        throw new Error('Could not create dir for component');
      }
    }

    /**
     * TODO: check write errors
     */
    write(path, this.source);

    //if (this.script) {
    //
    //  /**
    //   * TODO: create correct context
    //   */
    //  var context = vm.createContext({
    //    Component: this,
    //    fs: fs,
    //    console: console
    //  });
    //
    //  var bin = read(this.script);
    //  vm.runInContext(bin, context);
    //}
  },

  exists: function() {
    var path = normalize(join('./', this.path));

    return exists(path);
  },

  remove: function() {
    rimraf.sync(this.path);
  }
});


module.exports = Component;
