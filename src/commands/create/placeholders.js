'use strict';

var Placeholders = {
  parse: function (path) {
    return path.match(/:([^\/|\\|:|\-|\.]+)/g).filter(function (value, index, self) {
      return self.indexOf(value) === index
    }).map(function(value){
      return value.slice(1);
    });
  },

  map: function (placeholders, key) {
    var keys = key.split(':'),
      map = {};

    if (placeholders.length != keys.length){
      throw new Error('Wrong component key. Expected: ' + placeholders.join(', '));
    }

    for (var i = 0, size = keys.length; i < size; i++) {
      map[placeholders[i]] = keys[i];
    }

    return map;
  },

  dependency: function (path) {
    return path.match(/(\^[^\/|:|-]+:?)/g)
  }
};


module.exports = Placeholders;
