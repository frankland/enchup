var Q = require('q'),
  rimraf = require('rimraf'),
  exec = require('child_process').exec,
  fs = require('fs'),
  path = require('path'),
  Utils = require('../utils/include');


function exists(options){
  var deferred = Q.defer(),
    dir = Utils.app.getDir();


  if (fs.existsSync(dir)) {
    if (options.hasOwnProperty('force') && options.force) {

      var tree = Utils.app.getEnchupTree();

      for (var i = 0, size = tree.length; i < size; i++){
        var item = path.join(dir, tree[i][1]),
          type = tree[i][0];

        try {
          if (type == 'file') {
            fs.unlinkSync(item);
          } else if (type == 'dir'){
            rimraf.sync(item);
          }
        } catch (e){

        }
        deferred.resolve();
      }

    } else {
      deferred.reject(Utils.texts.err('setup.dir.exists'));
    }
  } else {
    deferred.resolve();
  }

  return deferred.promise;
}

function clone(enchup, options){
  var gh = 'https://github.com/' + enchup,
    tempDir = Utils.app.getTempDir(),
    dir = Utils.app.getDir();

  Utils.texts.log('setup.clone.start', {
    repo: enchup,
    dir: dir
  });

  var deferred = Q.defer();

  clearTmp();

  exec('git clone ' + gh + ' ' + tempDir, function(error){

    if (error){
      deferred.reject(Utils.texts.err('clone.git-error'));
    } else {
      if (error === null) {

        var tree = Utils.app.getEnchupTree();

        for (var i = 0, size = tree.length; i < size; i++){
          var oldPath = path.join(tempDir, tree[i][1]),
            newPath = path.join(dir, tree[i][1]);

          fs.renameSync(oldPath, newPath);
        }

        Utils.texts.log('setup.clone.finish');

        deferred.resolve();

        clearTmp();
      } else {
        deferred.reject(new Error(error.toString()));
      }
    }
  });

  return deferred.promise;
}

function clearTmp(){
  var tempDir = Utils.app.getTempDir();

  if (fs.existsSync(tempDir)){
    rimraf.sync(tempDir);
  }
}


module.exports = {

  run: function(enchup, options){

    if (!enchup){
      enchup = Utils.app.getDefaultRepo();
    }

    return exists(options)
      .then(function(){
        return clone(enchup, options);
      });
  }
};
