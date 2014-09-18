var Phrases = require('../utils/include').phrases,
  Config = require('../utils/include').config;

function write(config){
  if (config.hasOwnProperty('name')) {
    Phrases.log('info.name', {
      name: config.name
    });
  }

  if (config.hasOwnProperty('author')) {
    Phrases.log('info.author', {
      author: config.author
    });
  }

  if (config.hasOwnProperty('version')) {
    Phrases.log('info.version', {
      version: config.version
    });
  }

  if (config.hasOwnProperty('description')) {
    Phrases.log('info.description', {
      description: config.description
    });
  }

  if (config.hasOwnProperty('readme')) {
    Phrases.log('info.readme', {
      readme: config.readme
    });
  }
}

function info(){
  write(Config.asJson());
}


module.exports = info;
