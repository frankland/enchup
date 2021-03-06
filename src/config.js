'use strict';

var Boop = require('boop'),
    exists = require('fs').existsSync,
    read = require('fs').readFileSync,
    yaml = require('js-yaml');

var Config = Boop.extend({
  initialize: function(file) {
    var arr = yaml.safeLoad(read(file, 'utf8'));

    for (var item in arr) {
      if (arr.hasOwnProperty(item)) {
        this[item] = arr[item];
      }
    }

    this.loadAppConfig();
    this.loadUserConfig();
  },

  loadAppConfig: function() {
    var file = this.configs.app;

    if (exists(file)) {
      this.app_config = {};

      var arr = yaml.safeLoad(read(file, 'utf8'));
      for (var item in arr) {
        if (arr.hasOwnProperty(item)) {
          this.app_config[item] = arr[item];
        }
      }
    }
  },

  loadUserConfig: function() {
    var file = this.configs.user;

    if (exists(file)) {
      this.user_config = {};

      var arr = yaml.safeLoad(read(file, 'utf8'));
      for (var item in arr) {
        if (arr.hasOwnProperty(item)) {
          this.user_config[item] = arr[item];
        }
      }
    }
  }
});


module.exports = Config;
