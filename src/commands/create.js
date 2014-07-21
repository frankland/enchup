var Utils = require('../utils/include'),
  mkdirp = require('mkdirp'),
  fs = require('fs'),
  Q = require('q');

function getPlaceholders(path, keys){

  var placeholders = path.match(/(:[^\/|:|\-|\.]+:?)/g);

  if (!placeholders || !placeholders.length){
    throw Utils.texts.err('create.wrong-format');
  }

  placeholders = placeholders.filter(unique);

  if (!validate(keys, placeholders)){
    throw Utils.texts.err('create.wrong-format');
  }

  var result = {};

  for (var i = 0, size = placeholders.length; i < size; i++){
    var key = placeholders[i];
    if (key[0] == ':'){
      key = key.slice(1);
    }

    if (key[key.length - 1] == ':'){
      key = key.slice(0, -1);
    }

    result[key] = {
      placeholder: placeholders[i],
      value: keys[i]
    }
  }

  return result;
}

function unique(value, index, self) {
  return self.indexOf(value) === index;
}

function cutExtension(path){
  return path.replace(/\.[^\.]+$/,'')
}

function cutFileName(path){
  return path.match(/(.+)\//)[1];
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

    sub = cutFileName(sub);
    path = path.replace(placeholders[i], sub);
  }

  return path;
}

function getPath(component, key, config){

   var keys = key.split(':'),
    path = false,
    placeholders = {};

  if (!config.hasOwnProperty(component)){
    throw Utils.texts.err('create.no-component', {
      component: component
    });
  } else {

    path = loadDependencies(config, component);

    placeholders = getPlaceholders(path, keys);

    for (var name in placeholders){
      if (placeholders.hasOwnProperty(name)){
        var placeholder = placeholders[name];

        var re = new RegExp(placeholder.placeholder, 'g');
        path = path.replace(re, placeholder.value);
      }
    }
  }

  return {
    path: Utils.path.join('.', path),
    placeholders: placeholders
  }
}

function create(path, component, template, options){

  var dir = Utils.path.dirname(path.path);

  if (!fs.existsSync(dir)){
    var result = mkdirp.sync(dir);

    if (!result) {
      throw Utils.texts.err('create.cannot-create-dir', {
        dir: dir
      });
    }
  }

  var isWritable = false;

  if (fs.existsSync(path.path)){

    if (!options.force){
      throw Utils.texts.err('create.no-force');
    } else {
      fs.unlinkSync(path.path);
      isWritable = true;
    }
  } else {
    isWritable = true;
  }

  if (isWritable){

    var content = Utils.templates.getComponentTemplate(component, template);

    var placeholders = {};
    for (var item in path.placeholders){
      if (path.placeholders.hasOwnProperty(item)){
        placeholders[item] = path.placeholders[item].value;
      }
    }

    var compiled = Utils.templates.compile(content, placeholders);

    fs.writeFileSync(path.path, compiled);

    var tplName =  '';
    if (template){
      tplName = template;
    } else {
      if (content.length){
        tplName = 'default';
      } else {
        'empty';
      }
    }

    Utils.texts.log('create.success', {
      component: component,
      template: tplName,
      path: path.path
    });
  }
}

module.exports = {

  run: function(component, key, template, options){

    var components = Utils.config.getComponents();

    var deferred = Q.defer();

    try {
      var path = getPath(component, key, components);

      create(path, component, template, options);

      deferred.resolve();
    } catch(e){
      deferred.reject(e);
    }

    return deferred.promise;
  }
};