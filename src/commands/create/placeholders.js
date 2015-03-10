'use strict';


var Placeholders = {
  parse: function(path) {
    var matches = path.match(/:([^\/|\\|:|\-|\.]+)/g);
    var parsed = null;
    if (matches) {
      parsed =  matches.filter(function(value, index, self) {
        return self.indexOf(value) === index
      }).map(function(value) {
        return value.slice(1);
      });
    }

    return parsed;
  },

  map: function(placeholders, parameters) {
    var keys = parameters.split(':'),
        map = {};

    if (placeholders.length != keys.length) {
      throw new Error('Wrong component key. Expected: ' + placeholders.join(', '));
    }

    for (var i = 0, size = keys.length; i < size; i++) {
      map[placeholders[i]] = keys[i].toLowerCase();
    }

    return map;
  },

  dependency: function(path) {
    return path.match(/(\^[^\/|:|-]+:?)/g)
  }
};


module.exports = Placeholders;
