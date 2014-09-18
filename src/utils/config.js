var fs = require('fs'),
 yaml = require('js-yaml'),
 path = require('path'),
 app = require('./app'),
 Phrases = require('./phrases');

module.exports = {

  getConfigPath: function(){
    var dir = app.getDir();
    var name = app.getConfigName();
    return path.join(dir, name);
  },

  asJson: function(){
    var configFile = this.getConfigPath();

    if (!fs.existsSync(configFile)){
      throw Phrases.err('config.no-file', {
        file: configFile
      });
    }

    return yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
  },

  getComponents: function(){
    var config = this.asJson();

    if (!config.hasOwnProperty('components')){
      throw Phrases.err('config.no-components');
    }

    return config.components;
  },

  getParameters: function(){
    var config = this.asJson();

    return config.parameters || {};
  },

  getPath: function(component){
    if (!this.hasComponent(component)){
      throw new Error('Component is not defined');
    }

    var path = this.getComponents()[component];

    if (!Array.isArray(path)){
      path = [path];
    }

    return path;
  },

  hasComponent: function(component){
    return this.getComponents().hasOwnProperty(component);
  }
};