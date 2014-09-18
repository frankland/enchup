var rimraf = require('rimraf'),
  exec = require('exec-sync'),
  fs = require('fs'),
  path = require('path'),
  Phrases = require('../utils/phrases'),
  App = require('../utils/app');


function isForce(options){
  return options.hasOwnProperty('force') && options.force;
}

function cleanDir(){
  var tree = App.getEnchupTree(),
    dir = App.getDir();

  for (var i = 0, size = tree.length; i < size; i++){
    var item = path.join(dir, tree[i][1]),
      type = tree[i][0];

    try {
      if (type == 'file') {
        if (fs.existsSync(item)){
          // move
          if (tree[i][2] === true){
            var date = +(new Date()),
              name = item + '.' + date;

            if (fs.existsSync(name)){
              fs.unlinkSync(item);
            }

            fs.renameSync(item, name);
          } else {
            fs.unlinkSync(item);
          }
        }
      } else if (type == 'dir'){
        if (fs.existsSync(item)){
          rimraf.sync(item);
        }
      }
    } catch (e){
      throw Phrases.err('err', {
        message: e.message
      });
    }
  }
}

function removeTmp(){
  var tempDir = App.getTempDir();

  if (fs.existsSync(tempDir)){
    rimraf.sync(tempDir);
  }
}


function createDir(){
  var dir = App.getDir();

  if (!fs.existsSync(dir)){
    fs.mkdirSync(App.getDir());
  }
}

function exists(options){
  var dir = App.getDir(),
    isExist = false;

  if (fs.existsSync(dir)) {
    isExist = true;
    if (isForce(options)) {
      cleanDir();
      isExist = false;
    }
  }

  return isExist;
}

function copyTmpDir(){
  var tree = App.getEnchupTree(),
    dir = App.getDir(),
    tmp = App.getTempDir();

  for (var i = 0, size = tree.length; i < size; i++) {
    var oldPath = path.join(tmp, tree[i][1]),
      newPath = path.join(dir, tree[i][1]);

    fs.renameSync(oldPath, newPath);
  }
}

function clone(enchup){
  var gh = 'https://github.com/' + enchup,
    tmp = App.getTempDir(),
    dir = App.getDir();

  Phrases.log('setup.clone.start', {
    repo: enchup,
    dir: dir
  });

  removeTmp();

  var error = exec('git clone --quiet ' + gh + ' ' + tmp);

  if (!error) {
    copyTmpDir();
    removeTmp();
  } else {
    throw Phrases.err('setup.clone.error');
  }
}

module.exports =  function(enchup, options){
  var isExist = exists(options);

  if (isExist){
    throw Phrases.err('setup.dir.exists');
  }

  createDir();

  clone(enchup || App.getRepo());
};
