var chalk = require('chalk');

var phrases = {
  'setup.dir.exists': 'Config already exists. Add -f flag if you want to override it.',
  'setup.clone.start': 'Setup skeleton from {repo}:green to {dir}:green',
  'setup.clone.finish': 'Enchup structure was cloned successfully',
  'clone.git-error': 'Git clone error',

  'config.info.name': 'name - {name}:green',
  'config.info.author': 'author - {author}:yellow',
  'config.info.version': 'version - {version}:green',
  'config.info.description': 'description - {description}:green',
  'config.info.readme': 'readme - {readme}:green',
  'config.no-components': 'components are not defined',
  'config.unexist': 'Enchup file ({file}:underline) does not exist',

  'generate.info.init': '{Information about rjs plugins}:green',
  'generate.no-components': 'Components are not defined at enchup config',
  'generate.save.error': 'Can not save plugin - {name}:underline',
  'generate.save.success': 'Generated plugin - {name}:green',


  'create.no-component': 'Component {component}:underline does not exist',
  'create.wrong-format': 'Wrong component format',
  'create.cannot-create-dir': 'Can not create dir {dir}:underline',
  'create.no-force': 'Component already exists. If you want to override use -f flag',
  'create.success': 'Component {component}:green created using {template}:yellow template. Component path: {path}:underline',

  'templates.does-not-exist': 'Template does not exist'
};

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