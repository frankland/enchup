var Q = require('q'),
  rimraf = require('rimraf'),
  exec = require('child_process').exec,
  fs = require('fs'),
  Utils = require('../utils/include');


function exists(dir, options){
  var deferred = Q.defer();

  if (fs.existsSync(dir)) {
    if (options.hasOwnProperty('force') && options.force) {
      rimraf(dir, function(){
        deferred.resolve();
      });
    } else {
      deferred.reject(Utils.texts.err('setup.dir.exists'));
    }
  } else {
    deferred.resolve();
  }

  return deferred.promise;
}

function clone(dir, enchup, options){
  var gh = 'https://github.com/' + enchup;

  Utils.texts.log('setup.clone.start', {
    repo: enchup,
    dir: dir
  });

  var deferred = Q.defer();

  exec('git clone ' + gh + ' ' + dir, function(error){
    if (error){
      deferred.reject(new Error(error.toString()));
    } else {
      rimraf('.git', function(error) {
        if (error === null) {

          Utils.texts.log('setup.clone.finish');

          deferred.resolve();
        } else {
          deferred.reject(new Error(error.toString()));
        }
      });
    }
  });

  return deferred.promise;
}


module.exports = {

  run: function(enchup, options){
    var dir = Utils.app.getDir();

    if (!enchup){
      enchup = Utils.app.getDefaultRepo();
    }

    return exists(dir, options)
      .then(function(){
        return clone(dir, enchup, options);
      });
  }
};
