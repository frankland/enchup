'use strict';

var program = require('commander'),
  commands = require('./commands'),
  config = require('../package.json');

function setup(){
    program
      .usage('enchup [command]');

    program
      .version(config.version);

    program
      .command('setup [repository]')
      .option('-f, --force', 'Clear directory if it is not empty')
      .description('Initialize application structure. Plugins will be generated automatically.')
      .action(commands.setup);

    program
      .command('info')
      .description('Show ecchup info accroding to current structure')
      .action(commands.info);

    program
      .command('create <component> <parameters> [template]')
      .option('-f, --force', 'Override if already exists')
      .option('-c, --continue', 'Do not ovveride existing components')
      .description('Create components according to structure. <parameters> - :component..:component')
      .action(commands.create);
}

/**
 * Remove this arr
 */
var available = ['setup', 'info', 'create'];

module.exports = {

  run: function(){

    var command;

    if (process.argv[0] == 'node'){
      command = process.argv[2];
    } else {
      command = process.argv[1];
    }

    setup();

    if (available.indexOf(command) !== -1){
      program.parse(process.argv);
    } else {
      program.help();
    }
  }
};