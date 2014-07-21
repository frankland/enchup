var app = require('./app'),
  texts = require('./texts'),
  fs = require('fs'),
  path = require('path');


module.exports = {

  getComponentTemplate: function(component, template){
    var dir = app.getTempalteDir(),
      templatePath;

    if (template){
      templatePath = path.join(dir, component, template + '.js');
    } else {
      templatePath = path.join(dir, component, component + '.js');
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
  },

  compile: function(template, options){

    for (var placeholder in options){
      if (options.hasOwnProperty(placeholder)){
        template = template.replace(new RegExp('{{\\s*'+ placeholder +'\\s*}}', 'g'), options[placeholder]);
      }
    }

    return template;
  },

  getRjsTemplate: function(){
    return fs.readFileSync(
      path.join(path.dirname(fs.realpathSync(__filename)), '..', 'rjs', 'plugin-template.js'),
      {
        encoding: 'utf8'
      }
    );
  }
};