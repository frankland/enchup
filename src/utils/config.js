var fs = require('fs'),
 yaml = require('js-yaml'),
 path = require('path'),
 app = require('./app'),
 texts = require('./texts');

module.exports = {

  getConfigFile: function(){

    var dir = app.getDir();
    var name = app.getConfigName();

    return path.join(dir, name);
  },

  getConfig: function(){
    var configFile = this.getConfigFile();

    if (!fs.existsSync(configFile)){
      throw texts.err('config.unexist', {
        file: configFile
      });
    }

    return yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
  }
};