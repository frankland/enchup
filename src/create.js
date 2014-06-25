var config = require('./config'),
    $q = require('q'),
    mkdirp = require('mkdirp'),
    chalk = require('chalk'),
    path = require('path'),
    fs = require('fs');


function validate (cfg, component){

  return (!cfg.hasOwnProperty('module')
            || !cfg.hasOwnProperty('components')
            || cfg.components.hasOwnProperty(component));
}

module.exports = function (dir, component, parameters, template, options){

  function parse(){
    var deferred = $q.defer();

    var cfg = config.get(dir);

    if (!validate(cfg, component)){
      deferred.reject(new Error('Invalid config'));
    }

    var parsed = parameters.split(':');

    if (parsed.length != 2){
      deferred.reject(new Error('Invalid component definition'));
      return deferred.promise;
    }

    var names = {
      module: parsed[0],
      name: parsed[1]
    };

    var structure = cfg.components[component]
      .replace(new RegExp('{' + component + '}', 'g'), names.name);

    var module = cfg.modules
      .replace(new RegExp('{module}', 'g'), names.module);

    var parts = ['.']
      .concat(module.split('/'))
      .concat(structure.split('/'));


    var componentPath = path.join.apply(null, parts);
    var componentFile = parts.pop();
    var componentDir = path.join.apply(null, parts);

    console.log('generate component: ' + chalk.blue(componentPath));
    deferred.resolve({
      dir: componentDir,
      path: componentPath,
      names: names,
      template: template
    });

    return deferred.promise;
  }

  function createDir(process){
    var deferred = $q.defer();

    var componentPath = process.path;
    var componentDir = process.dir;

    mkdirp(componentDir, function(error){

      if (error){
        deferred.reject(new Error(error.toString()));
      }

      if (fs.existsSync(componentPath)){
        if (!options.force){
          deferred.reject(new Error('Component with this name already exists. You can add -f flag to override it'));
        } else {
          fs.unlinkSync(componentPath);
          deferred.resolve(process);
        }
      } else {
        deferred.resolve(process);
      }
    });

    return deferred.promise;
  }

  function createTemplates(process){

    var tpl = config.template(dir, component, process.template);


//    var componentDir = process.dir;
//    var componentFile = process.file;
    var componentPath = process.path;

    if (tpl){

      console.log('Fill with template: ' + chalk.blue(config.templatePath(dir, component, process.template)));

      tpl = tpl
            .replace(new RegExp('{{ name }}', 'g'), process.names.name)
            .replace(new RegExp('{{ module }}', 'g'), process.names.module);

      fs.writeFileSync(componentPath, tpl);
    } else {
      fs.writeFileSync(componentPath, '');
    }
  }

  return parse()
          .then(createDir)
          .then(createTemplates);
};
