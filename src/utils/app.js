var path = require('path');

module.exports = {

  getDir: function(){
    return path.join('.', 'enchup');
  },

  getTemplateDir: function(isRepoTemplates){
    var dir;
    if (isRepoTemplates){
      dir = path.join(this.getDir(), this.getRepoTemplateDirName());
    } else {
      dir = path.join(this.getDir(), 'templates');
    }

    return dir;
  },

  getRepoTemplateDirName: function(){
    return 'repo-templates';
  },

  getConfigName: function(){
    return 'enchup.yml';
  },

  getRepo: function(){
    return 'tuchk4/enchup-simple-struct';
  },

  getPluginsDir: function(){
    return path.join(this.getDir(), 'plugins');
  },

  getPluginTemplatesDir: function(){
    return path.join(this.getDir(), 'plugins-templates');
  },

  getTempDir: function(){
    return path.join(this.getDir(), 'tmp');
  },

  getEnchupTree: function(){
    return [
      ['file', this.getConfigName(), true],
      ['file', 'README.md'],
      ['dir', this.getRepoTemplateDirName()]
    ];
  }
};