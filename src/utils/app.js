var path = require('path');

module.exports = {

  getDir: function(){
    return path.join('.', 'enchup');
  },

  getTempalteDir: function(){
    return path.join(this.getDir(), 'templates');
  },

  getConfigName: function(){
    return 'enchup.yml';
  },

  getDefaultRepo: function(){
    return 'tuchk4/enchup-simple-struct';
  },

  getPluginsDir: function(){
    return path.join(this.getDir(), 'enchup-rjs-plugins');
  },

  getRjsTemplatesDir: function(){
    return path.join(this.getDir(), 'rjs-templates');
  }
};