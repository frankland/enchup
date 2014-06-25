var exec = require('child_process').exec;
var rimraf = require('rimraf');
var $q = require('q');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs');

function exists(dir, options){
  var deferred = $q.defer();

  if (fs.existsSync(dir)){
    if (options.force){
      rimraf(dir, function(){
        console.log(chalk.green('Removed prev config'));
        deferred.resolve();
      });
    } else {
      deferred.reject(new Error('Config already exists. Add -f flag if you want to override it.'));
    }
  } else {
    deferred.resolve();
  }

  return deferred.promise;
}

module.exports = function(dir, structure, options){

  function clone(){
    var gh = 'https://github.com/' + structure;

    console.log('Setup skeleton from ' + chalk.green(gh) + ' to '  + chalk.green(dir));

    var deferred = $q.defer();

    exec('git clone ' + gh + ' ' + dir, function(error, stdout, stderr){
      if (error){
        deferred.reject(new Error(error.toString()));
      } else {

        rimraf('.git', function(error) {
          if (error != null) {
            deferred.reject(new Error(error.toString()));
          } else {
            deferred.resolve(dir);
          }
        });
      }
    });

    return deferred.promise;
  }

  return exists(dir, options)
          .then(clone);
};