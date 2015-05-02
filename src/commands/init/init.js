'use strict';

var Command = require('../command'),
    readdir = require('fs').readdirSync,
    path = require('path'),
    exec = require('child_process').exec,
    rimraf = require('rimraf'),
    Init = Command.extend({

      initialize: function() {
        this.initPromise();
      },

      exec: function(repository) {

        return this.flow()
            .then(this.prepare.bind(this))
            .then(this.clone.bind(this, repository))
            .then(this.clean.bind(this));
      },

      prepare: function() {
        var dir = readdir('.');

        if (!!dir.length){
          throw  new Error('Init: current dir should be empty');
        }
      },

      clone: function(repository) {

        if (!repository){
          throw new Error('Init: repository is not defined and default value is not set');
        }

        var gh = 'https://github.com/' + repository,
            deffered = this.createDeferred();

        exec('git clone --quiet ' + gh + ' . ', function(error) {
          if (error === null) {
            deffered.resolve();
          } else {
            deffered.reject(error);
          }
        });

        return deffered.promise;
      },

      clean: function(){
        rimraf.sync('.git');
      }
    });


module.exports = Init;
