var Utils = require('../utils/include'),
  Config = require('../utils/config'),
  Templates = require('../utils/templates'),
  Phrases = require('../utils/phrases'),
  mkdir = require('mkdirp'),
  join = require('path').join,
  dirname = require('path').dirname,
  fs = require('fs');

function getPlaceholders(path){

  var placeholders = path.match(/(:[^\/|:|\-|\.]+:?)/g).filter(unique),
    result = [];

  for (var i = 0, size = placeholders.length; i < size; i++){
    var key = placeholders[i];
    if (key[0] == ':'){
      key = key.slice(1);
    }

    if (key[key.length - 1] == ':'){
      key = key.slice(0, -1);
    }

    result.push(key);
  }

  return result;
}

function unique(value, index, self) {
  return self.indexOf(value) === index;
}

function cutExtension(path){
  var result;
  if (isFile(path)){
    result = path.replace(/\.[^\.]+$/,'');
  } else {
    result = path;
  }

  return result;
}

function cutFileName(path){
  return path.match(/(.+)\//)[1];
}

function isFile(path){
  return !!path.match(/\/.+\.([^.|\/]+)$/);
}

function isForce(options){
  return options.hasOwnProperty('force') && options.force;
}

function create(path, component, template, options){

  var dir = dirname(path.path);

  if (!fs.existsSync(dir)){
    if (mkdir.sync(dir) === null) {
      throw Phrases.err('create.cannot-create-dir', {
        dir: dir
      });
    }
  }

  if (fs.existsSync(path.path)){
    if (isForce(options)){
      fs.unlinkSync(path.path);
    } else {
      throw Phrases.err('create.no-force');
    }
  }

  var content = Templates.getComponentTemplate(component, template);
  var compiled = Templates.compile(content, path.placeholders);

  xxx
  fs.writeFileSync(path.path, compiled);

  var tplName =  '';
  if (template){
    tplName = template;
  } else {
    if (content.length){
      tplName = 'default';
    } else {
      tplName = 'empty';
    }
  }

  Utils.texts.log('create.success', {
    component: component,
    template: tplName,
    path: path.path
  });
}

function replacePath(path, key, replacements){
  var result = [];

  for (var i = 0, size = replacements.length; i < size; i++){
    var withoutFileName = cutExtension(replacements[i]); //cutFileName(replacements[i]);

    result.push(path.replace(key, withoutFileName));
  }

  return result;
}

function loadDependencies(component){

  var list = Config.getPath(component),
    result = [];

  for (var i = 0, size = list.length; i < size; i++){
    var path = list[i],
      placeholders = path.match(/(\^[^\/|:|-]+:?)/g);

    if (placeholders === null){
      result.push(path);
    } else if (placeholders.length === 1){
      var parent = placeholders[0].slice(1),
        parentPath = loadDependencies(parent);

      result = result.concat(replacePath(path, placeholders[i], parentPath));
    } else {
      throw Phrases.err('create.wrong-config');
    }

  }

  return result;
}


function getProperPath(list, keys){
  var proper = {};

  for (var i = 0, size = list.length; i < size; i++){
    var placeholders = getPlaceholders(list[i], keys);

    if (placeholders.length == keys.length){
      if (!!Object.keys(proper).length){
        throw Phrases.err('create.wrong-config');
      }

      proper.placeholders = placeholders;
      proper.path = list[i];
    }
  }

  return proper;
}

function getPath(component, key){

  var keys = key.split(':'),
    list = loadDependencies(component),
    proper = getProperPath(list, keys),
    path = proper.path,
    placeholders = proper.placeholders,
    scope = {};


  if (!path){
    throw Phrases.err('create.wrong-config');
  }

  for (var i = 0, size = placeholders.length; i < size; i++){
    var placeholder = placeholders[i],
      value = keys[i],
      re = new RegExp(':' + placeholder, 'g');

    scope[placeholder] = value;

    path = path.replace(re, value);
  }

  return {
    path: join('.', path),
    placeholders: scope
  }
}

module.exports = function(component, key, template, options){

  var path = getPath(component, key);

  create(path, component, template, options);
};
