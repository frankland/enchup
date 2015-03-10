var Handlebars = require('handlebars');

Handlebars.registerHelper('ucfirst', function(str) {
  var first = str.charAt(0).toUpperCase();
  return first + str.toLowerCase().substr(1, str.length-1);
});

Handlebars.registerHelper('uppercase', function(str) {
  return str.toUpperCase();
});

Handlebars.registerHelper('lowercase', function(str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('tail', function(str) {
  return str.split('/').pop()
});


module.exports =  Handlebars;
