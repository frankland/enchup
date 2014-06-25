var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var $q = require('q');
var chalk = require('chalk');
var rimraf = require('rimraf');

var program = require('./program');


function getTemplate(){
  return fs.readFileSync(
    path.join(path.dirname(fs.realpathSync(__filename)), 'templates', 'plugin-component.js'),
    {
      encoding: 'utf8'
    }
  );
}

function compile(template, vars){
  return template
    .replace(new RegExp('{{ structure }}', 'g'), vars.structure)
    .replace(new RegExp('{{ name }}', 'g'), vars.name);
}

function save(dir, name, plugin){

  var deferred = $q.defer();

  var pluginPath = path.join(dir, name + '.js');

  fs.writeFile(pluginPath, plugin, function(error){
    if (error){
      console.log('Can not save plugin:  ' + chalk.red(name));
      deferred.reject();
    } else {
      console.log('Generated plugin: ' + chalk.yellow(name));
      deferred.resolve(pluginPath);
    }
  });

  return deferred.promise;
}

function getDir(root, config){
  var dir;

  if (config.hasOwnProperty('dir')){
    dir = path.join(root, config.dir)
  } else {
    dir = path.join(root, 'require-js-plugins');
  }

  return dir;
}

function createDir(dir){
  var deferred = $q.defer();


  function create(){

    mkdirp(dir, function(error){
      if (error){
        deferred.reject(new Error(error.toString()));
      } else {
        deferred.resolve(dir);
      }
    });
  }

  if (fs.existsSync(dir)){
    rimraf(dir, create);
  } else {
    create();
  }

  return deferred.promise;
}

function create(config, dir){
  var deferred = $q.defer();

  var components = config.components;
  var savers = [];

  console.log('');
  for (var name in components){
    if (components.hasOwnProperty(name)){

      var template = getTemplate();
      var plugin = compile(template, {
        structure: components[name],
        name: name
      });

      savers.push(
        save(dir, name, plugin)
      );
    }
  }

  $q.all(savers).then(function(){
    deferred.resolve();
  });

  return deferred.promise;
}

function info(dir, config){
  var components = config.components;

  dir = getDir(dir, config);

  console.log('');
  console.log('Plugins should be included to requirejs config:');
  console.log(chalk.cyan('requirejs.config({'));
  console.log(chalk.cyan('  path: {'));

  for (var name in components){
    if (components.hasOwnProperty(name)){
      console.log(chalk.cyan('    \'' + name + '\': \'' + dir + '/' + name + '\','));
    }
  }

  console.log(chalk.cyan('  }'));
  console.log(chalk.cyan('});'));
  console.log('');

  console.log('To generate components you could use ' + chalk.green('create') + ' command.');
  console.log('    eva ' + chalk.green('create') + ' <component> <module-name>:<component-name> []');
  console.log('');
}

module.exports = {

  info: function(dir, config){

    info(dir, config);
  },

  generate: function(root, config){
    var dir = getDir(root, config);

    return createDir(dir)
      .then(create.bind(null, config))
      .then(info.bind(null, dir, config));
  }
};