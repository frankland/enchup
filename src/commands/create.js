var Utils = require('../utils/include'),
  mkdirp = require('mkdirp'),
  fs = require('fs'),
  Q = require('q');

function unique(value, index, self) {
  return self.indexOf(value) === index;
}

function validate(keys, placeholders){
  var result = true;

  if (!keys.length || !placeholders.length){
    result = false;
  }

  if (keys.length != placeholders.length){
    result = false;
  }

  return result;
}

function loadDependencies(config, component){
  var path = config[component];

  var placeholders = path.match(/(\^[^\/|:|-]+:?)/g);

  if (!placeholders || !placeholders.length){
    return path;
  }

  placeholders = placeholders.filter(unique);

  for (var i = 0, size = placeholders.length; i < size; i++){
    var key = placeholders[i].slice(1);
    if (!config.hasOwnProperty(key)){
       throw new Utils.texts.err('create.wrong-format');
    }

    var sub = loadDependencies(config, key);

    if (!sub){
      throw new Utils.texts.err('create.wrong-format');
    }

    path = path.replace(placeholders[i], sub);
  }

  return path;
}

function getPath(component, key, config){

   var keys = key.split(':'),
    path = false;

  if (!config.hasOwnProperty(component)){
    throw Utils.texts.err('create.no-component', {
      component: name
    });
  } else {

    path = loadDependencies(config, component);

    var placeholders = path.match(/(:[^\/|:|\-|\.]+:?)/g);

    if (!placeholders || !placeholders.length){
      throw new Utils.texts.err('create.wrong-format');
    }

    placeholders = placeholders.filter(unique);



    if (!validate(keys, placeholders)){
      throw new Utils.texts.err('create.wrong-format');
    } else {

      for (var i = 0, size = placeholders.length; i < size; i++){
          var re = new RegExp(placeholders[i], 'g');
          path = path.replace(re, keys[i]);
      }
    }
  }

  return Utils.path.join('.', path);
}

function create(path, template){

  var dir = Utils.path.dirname(path),
    result = mkdirp.sync(dir);

  if (!result) {
    throw new Error(result);
  }


  if (fs.existsSync(path)){
    fs.unlinkSync(path);

    if (!options.force){

    } else {

    }
  }

  fs.writeFileSync(path, 'tpl');
}

function compile(template, options){

}

module.exports = {

  run: function(component, key, template){
    var config = Utils.config.getConfig(),
      components = config.components;

    var path = getPath(component, key, components);

    create(path);

    console.log(path);

    return Q.when(null);
  }
};