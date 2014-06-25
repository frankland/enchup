var program = require('commander'),
  commands = require('./commands'),
  config = require('../package.json');

module.exports = {
  setup: function(){
    program
      .usage('eva [command]');

    program
      .version(config.version);

    program
      .command('setup [skeleton] [dir] ')
      .option('-f, --force', 'Clear directory if it is not empty')
      .description('Initialize application structure. Plugins will be generated automatically.')
      .action(commands.setup);

    program
      .command('plugins')
      .description('Generate requriejs plugins')
      .action(commands.plugins);

    program
      .command('info')
      .description('Show app info')
      .action(commands.info);

    program
      .command('create <component> <parameters> [template]')
      .option('-f, --force', 'Override if already exists')
      .description('Create components according to structure. <parameters> - {module-name}:{component-name}')
      .action(commands.create);
  },

  run: function(){
    this.setup();
    program.parse(process.argv);
  },

  program: function(){
    return program;
  }
};
