'use strict';

var Command = require('../command'),
  fs = require('fs'),
  path = require('path'),
  exec = require('child_process').exec,
  rimraf = require('rimraf'),
  mkdir = require('mkdirp').sync,
  Setup = Command.extend({

    initialize: function () {
      this.initPromise();
    },

    exec: function (repository) {

      return this.flow()
        .then(this.prepare.bind(this))
        .then(this.create.bind(this))
        .then(this.clone.bind(this, repository || this.config.repository));
    },


    clone: function (repository) {
      var gh = 'https://github.com/' + repository,
        temp = this.config.temp,

        copy = this.copy.bind(this),
        removeTemp = this.removeTemp.bind(this),

        deffered = this.createDeferred();

      this.removeTemp();

      exec('git clone --quiet ' + gh + ' ' + temp, function (error) {
        if (error === null) {
          copy();
          removeTemp();

          deffered.resolve();
        } else {
          deffered.reject(error);
        }
      });

      return deffered.promise;
    },

    copy: function () {
      var tree = this.config.tree,
        dir = this.config.dir,
        temp = this.config.temp;

      for (var i = 0, size = tree.length; i < size; i++) {
        var from = path.join(temp, tree[i][1]),
          to = path.join(dir, tree[i][1]);

        if (tree[i][0] == 'dir'){
          mkdir(to);
        }

        fs.renameSync(from, to);
      }
    },

    create: function () {
      var dir = this.config.dir;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    },

    removeTemp: function () {
      var temp = this.config.temp;

      if (fs.existsSync(temp)) {
        rimraf.sync(temp);
      }
    },

    clean: function () {
      var tree = this.config.tree,
        dir = this.config.dir;

      for (var i = 0, size = tree.length; i < size; i++) {
        var item = path.join(dir, tree[i][1]),
          type = tree[i][0];

        if (type == 'file') {
          if (fs.existsSync(item)) {
            // move
            if (tree[i][2] === true) {
              var date = +(new Date()),
                name = item + '.' + date;

              if (fs.existsSync(name)) {
                fs.unlinkSync(item);
              }

              fs.renameSync(item, name);
            } else {
              fs.unlinkSync(item);
            }
          }
        } else if (type == 'dir') {
          if (fs.existsSync(item)) {
            rimraf.sync(item);
          }
        }
      }
    },

    prepare: function () {
      var dir = this.config.dir;

      if (fs.existsSync(dir)) {
        if (this.isForce()) {
          this.clean();
        } else {
          throw new Error('Dir exists. No -f');
        }
      }
    }
  });


module.exports = Setup;
