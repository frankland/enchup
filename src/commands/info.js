var Q = require('q'),
  Utils = require('../utils/include');


function write(config){
  if (config.hasOwnProperty('name')) {
    Utils.texts.log('config.info.name', {
      name: config.name
    });
  }

  if (config.hasOwnProperty('author')) {
    Utils.texts.log('config.info.author', {
      author: config.author
    });
  }

  if (config.hasOwnProperty('version')) {
    Utils.texts.log('config.info.version', {
      version: config.version
    });
  }

  if (config.hasOwnProperty('description')) {
    Utils.texts.log('config.info.description', {
      description: config.description
    });
  }

  if (config.hasOwnProperty('readme')) {
    Utils.texts.log('config.info.readme', {
      readme: config.readme
    });
  }
}

function info(){
  var deferred = Q.defer();

  try {
    var config = Utils.config.getConfig();

    write(config);

    deferred.resolve();
  } catch (e){

    deferred.reject(e);
  }

  return deferred.promise;
}


module.exports = {

  run: function(){
    return info();
  }
};
