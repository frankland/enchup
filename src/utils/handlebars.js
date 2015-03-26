var Handlebars = require('handlebars');

/**
 * NOTE: now if empty placholder - just replace with empty string. Dont check it
 */
function check(str, helper) {
  if (undefined === str) {
    throw new Error('Empty value for "' + helper + '"');
  }
}

function ucfirst(str) {
  var input = (str || '');

  var first = input.charAt(0).toUpperCase();
  return first + input.toLowerCase().substr(1, input.length-1);
}

function uppercase(str) {
  return (str || '').toUpperCase();
}

function lowercase(str) {
  return (str || '').toLowerCase();
}

function tail(str) {
  return (str || '').split('/').pop()
}

function dots(str) {
  return (str || '').toLowerCase().replace(/\//g, '.');
}

function normalize(str) {
  return ucfirst(str || '').replace(/-(.)/g, function(match, point) {
    return point.toUpperCase();
  });
}


Handlebars.registerHelper('ucfirst', ucfirst);
Handlebars.registerHelper('uppercase', uppercase);
Handlebars.registerHelper('lowercase', lowercase);
Handlebars.registerHelper('tail', tail);
Handlebars.registerHelper('dots', dots);
Handlebars.registerHelper('normalize', normalize);


module.exports =  Handlebars;
