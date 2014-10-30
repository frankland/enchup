"use strict";

var Command = require('../command'),
  path = require('path'),
  Types = require('../../utils/types'),
  TreeClass = require('./tree'),
  Build = Command.extend({

    initialize: function () {
      this.initPromise();
    },

    setComponent: function (component) {
      this.component = component;
    },

    exec: function () {

      return this.flow()
        .then(this.validate.bind(this))
        .then(this.getTree.bind(this))
        .then(this.build.bind(this));
    },

    validate: function () {
      if (!this.config.hasOwnProperty('build_config')) {
        throw new Error('Can not exec build command because of build-enchup.yml does not exist');
      }

      if (!this.config.build_config.hasOwnProperty('files')) {
        throw new Error('Files are not described');
      }

      if (!Types.isArray(this.config.build_config.files)) {
        throw new Error('Files should be described as array');
      }

      if (!this.config.build_config.files.length) {
        throw new Error('Files are described as empty array');
      }
    },

    getTree: function () {
      var files = this.config.build_config.files,
        dist = this.config.build_config.dist;

      return new TreeClass(dist, files);
    },

    build: function (Tree) {

      Tree.each(function(namespace, item){
        // Tree.copy(namespace);

      });
    }
  });


module.exports = Build;
