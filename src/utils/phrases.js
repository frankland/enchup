var chalk = require('chalk');
var phrases = require('../texts');

var Texts = {
  compile: function(key, options){
    var phrase;

    if (phrases.hasOwnProperty(key)){
      phrase = phrases[key];
    } else {
      phrase = 'Phrase is not defined';
    }

    var matches = phrase.match(/\{\s*[^\}]+\}:?[^\s|\)]*/ig);

    if (matches && matches.length){
      for (var i = 0, size = matches.length; i < size; i++){
        var rplc = matches[i];

        var parts = rplc.split(':'),
          part = parts[0].slice(1).slice(0, -1);

        if (options && options.hasOwnProperty(part)){
          part = options[part];
        }

        if (parts.length == 2){
          phrase = phrase.replace(rplc, chalk[parts[1]](part));
        } else {
          phrase = phrase.replace(rplc, part);
        }
      }
    }

    return phrase;
  },

  err: function(key, options){
    var message = Texts.compile(key, options);
    return new Error(message);
  },

  log: function(key, options){
    console.log(Texts.compile(key, options))
  }
};

module.exports = Texts;