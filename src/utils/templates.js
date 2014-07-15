var app = require('./app'),
  fs = require('fs'),
  path = require('path');


module.exports = {

  getComponentTemplate: function(component, key){

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