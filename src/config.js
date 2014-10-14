'use strict';

var Boop = require('boop'),
  fs = require('fs'),
  yaml = require('js-yaml');

var Config = Boop.extend({
  initialize: function(file){
    var arr =  yaml.safeLoad(fs.readFileSync(file, 'utf8'));

    for (var item in arr){
      if (arr.hasOwnProperty(item)){
        this[item] = arr[item];
      }
    }

    this.loadAppConfig();
  },

  loadAppConfig: function(){
    var file = this.config;

    if (fs.existsSync(file)){
      this.app = {};

      var arr =  yaml.safeLoad(fs.readFileSync(file, 'utf8'));
      for (var item in arr){
        if (arr.hasOwnProperty(item)){
          this.app[item] = arr[item];
        }
      }
    }
  }
});


module.exports = Config;