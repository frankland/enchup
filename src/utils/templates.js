var app = require('./app'),
  texts = require('./texts'),
  config = require('./config'),
  fs = require('fs'),
  path = require('path');

var types = {
  'json-plugin-template.js': ['json'],
  'text-plugin-template.js': ['html', 'md']
};

function getExtension(component){
  var path = config.getComponent(component);

  return path.split('.').pop();
}

function getTemplateByExt(component){
  var path = config.getComponent(component),
    ext = getExtension(component);

  var template = 'plugin-template.js';

  for (var type in types){
    if (types.hasOwnProperty(type)){
      if (types[type].indexOf(ext) != -1){
        template = type;
        break;
      }
    }
  }

  return template;
}

function getTemplate(dir, component, template){
  var templatePath;

  if (template){
    templatePath = path.join(dir, component, template + '.' + getExtension(component));
  } else {
    templatePath = path.join(dir, component, component + '.' + getExtension(component));
  }

  var content;

  if (fs.existsSync(templatePath)){
    content = fs.readFileSync(templatePath, {
      encoding: 'utf8'
    });
  } else {
    texts.log('templates.does-not-exist');
    content = '';
  }

  return content;
}

module.exports = {


  getComponentTemplate: function(component, template){

    var dir = app.getTempalteDir(component);
    var content = getTemplate(dir, component, template);

    if (!content){
      dir = app.getRepoTempalteDir(component);
      content = getTemplate(dir, component, template);
    }

    return content;
  },

  compile: function(template, options){

    var global = config.getParameters();

    for (var placeholder in options){
      if (options.hasOwnProperty(placeholder)){
        template = template.replace(new RegExp('{{\\s*'+ placeholder +'\\s*}}', 'g'), options[placeholder]);
      }
    }

    for (var placeholder in global){
      if (global.hasOwnProperty(placeholder)){
        template = template.replace(new RegExp('{{\\s*'+ placeholder +'\\s*}}', 'g'), global[placeholder]);
      }
    }

    return template;
  },

  getRjsTemplate: function(component){
    var template = getTemplateByExt(component);

    return fs.readFileSync(
      path.join(path.dirname(fs.realpathSync(__filename)), '..', 'rjs', template),
      {
        encoding: 'utf8'
      }
    );
  }
};