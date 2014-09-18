var App = require('./app'),
  Phrases = require('./phrases'),
  Config = require('./config'),
  fs = require('fs'),
  path = require('path');

//var types = {
//  'json-plugin-template.js': ['json'],
//};

function getExtension(path){ console.log(path);
  return path.split('.').pop();
}

//function getTemplateByExt(component){
//  var path = config.getComponent(component),
//    ext = getExtension(component);
//
//  var template = 'plugin-template.js';
//
//  for (var type in types){
//    if (types.hasOwnProperty(type)){
//      if (types[type].indexOf(ext) != -1){
//        template = type;
//        break;
//      }
//    }
//  }
//
//  return template;
//}

function getTemplate(dir, component, template){

  var name = !!template ? template : component,
    templatePath = path.join(dir, component, name + '.' + getExtension(component)),
    content = '';

  if (fs.existsSync(templatePath)){
    content = fs.readFileSync(templatePath, {
      encoding: 'utf8'
    });
  } else {
    Phrases.log('templates.does-not-exist');
  }

  return content;
}

module.exports = {


  getComponentTemplate: function(component, template){

    var dir = App.getTemplateDir(component);
    var content = getTemplate(dir, component, template);

    if (!content){
      var isRepo = true;
      dir = App.getTemplateDir(component, isRepo);
      content = getTemplate(dir, component, template);
    }

    return content;
  },

  compile: function(template, options){

    var global = Config.getParameters();

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
  }

//  getRjsTemplate: function(component){
//    var template = getTemplateByExt(component);
//
//    return fs.readFileSync(
//      path.join(path.dirname(fs.realpathSync(__filename)), '..', 'rjs', template),
//      {
//        encoding: 'utf8'
//      }
//    );
//  }
};