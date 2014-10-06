'use strict';

var Command = require('../command'),
  path = require('path'),
  Info = Command.extend({

    initialize: function () {
      this.initPromise();
    },

    exec: function () {


      return this.flow()
        .then(this.info.bind(this));
    },

    info: function () {
      var config = this.config;

      if (!config.hasOwnProperty('app')){
        throw new Error('App config does not exists');
      }

      if (config.app.hasOwnProperty('name')) {
        console.log(config.app.name);
      }

      if (config.app.hasOwnProperty('author')) {
        console.log(config.app.author);
      }

      if (config.app.hasOwnProperty('version')) {
        console.log(config.app.version);
      }

      if (config.app.hasOwnProperty('description')) {
        console.log(config.app.description);
      }

      if (config.app.hasOwnProperty('readme')) {
        console.log(config.app.readme);
      }
    }
  });


module.exports = Info;