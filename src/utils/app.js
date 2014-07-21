var path = require('path');

module.exports = {

  getDir: function(){
    return path.join('.', 'enchup');
  },

  getTempalteDir: function(){
    return path.join(this.getDir(), 'templates');
  },

  getRepoTempalteDir: function(){
    return path.join(this.getDir(), this.getRepoTemplateDirName());
  },

  getRepoTemplateDirName: function(){
     return 'repo-templates';
  },

  getConfigName: function(){
    return 'enchup.yml';
  },

  getDefaultRepo: function(){
    return 'tuchk4/enchup-simple-struct';
  },

  getPluginsDir: function(){
    return path.join(this.getDir(), this.getPluginsDirName());
  },

  getPluginsDirName: function(){
    return 'enchup-rjs-plugins';
  },

  getRjsTemplatesDir: function(){
    return path.join(this.getDir(), 'rjs-templates');
  },

  getTempDir: function(){
    return path.join('/tmp', 'enchup-temp');
  },

  getEnchupTree: function(){
    return [
      ['file', this.getConfigName()],
      ['file', 'README.md'],
      ['dir', this.getRepoTemplateDirName()]
//      ['dir', this.getPluginsDirName()]
    ];
  }
};