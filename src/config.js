var fs = require('fs');
var yaml = require('js-yaml');
var path = require('path');
var $q = require('q');
var chalk = require('chalk');

module.exports = {

  file: function(dir){
    return path.join(dir, 'skeleton.yml');
  },

  get: function(dir){
    var config = this.file(dir);
    return yaml.safeLoad(fs.readFileSync(config, 'utf8'));
  },

  templatePath: function(dir, component, template){

    return template
      ? path.join(dir, 'templates', component + '-' + template)
      : path.join(dir, 'templates', component);
  },

  template: function(dir, component, template){

    var path = this.templatePath(dir, component, template),
      result;


    if (fs.existsSync(path)){
      result = fs.readFileSync(path, {
        encoding: 'utf8'
      });
    } else {
      console.log('Template does not exists: ' + path);
      result = false;
    }

    return result;
  },

  exists: function(dir){
    return fs.existsSync(this.file(dir));
  },

  info: function(dir){

    var config = this.get(dir);

    if (config.hasOwnProperty('author')){
      console.log('author: ' + chalk.green(config.author));
    }

    if (config.hasOwnProperty('version')){
      console.log('version: ' + chalk.green(config.version));
    }

    if (config.hasOwnProperty('description')){
      console.log('description: ' + chalk.green(config.description));
    }

    if (config.hasOwnProperty('readme')){
      console.log('readme: ' + chalk.green(config.readme));
    }
  },

  validate: function(){
    return this.get().then(function(config){
      if  (config.hasOwnProperty('components') && config.hasOwnProperty('module')){
        throw new Error('Invalid config');
      }
    });
  }
};