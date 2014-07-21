var Utils = require('../utils/include'),
  Q = require('q'),
  fs = require('fs'),
  path = require('path'),
  rimraf = require('rimraf'),
  mkdirp = require('mkdirp');


function createDir(){
  var dir = Utils.app.getPluginsDir();

  var deferred = Q.defer();

  mkdirp(dir, function(err){
    if (err === null){
      deferred.resolve(dir);
    } else {
      deferred.reject(new Error(err));
    }
  });

  return deferred.promise;
}


function clearDir(){
  var dir = Utils.app.getPluginsDir();

  var deferred = Q.defer();

  if (fs.existsSync(dir)){
    rimraf(dir, function(err){
      if (err === null) {
        deferred.resolve();
      } else {
        deferred.reject(new Error(err));
      }
    });
  } else {
    deferred.resolve();
  }

  return deferred.promise;
}

function save(dir, name, plugin){

  var pluginPath = path.join(dir, name + '.js');

  // TODO:
  try {
    fs.writeFileSync(pluginPath, plugin);

    Utils.texts.log('generate.save.success', {
      name: name
    });
  } catch (e){
    Utils.texts.log('generate.save.error', {
      name: name
    });
  }
}

function compile(template, vars){
  return template
    .replace(new RegExp('\'{{ structure }}\'', 'g'), JSON.stringify(vars.structure))
    .replace(new RegExp('{{ name }}', 'g'), vars.name);
}

function generate(){
  var dir = Utils.app.getPluginsDir();
  var config = Utils.config.getConfig();

  if (!config.hasOwnProperty('components')){
    throw Utils.err('generate.no-components');
  } else {

    var components = config.components;

    for (var name in components){
      if (components.hasOwnProperty(name)){

        var template = Utils.templates.getRjsTemplate(name);

        var plugin = compile(template, {
          structure: components,
          name: name
        });

        save(dir, name, plugin);
      }
    }
  }
}

module.exports = {
  info: function(){
    Utils.texts.log('generate.info.init');

    return Q.when(null);
  },

  run: function(){
    return clearDir()
      .then(createDir)
      .then(generate)
  }
}