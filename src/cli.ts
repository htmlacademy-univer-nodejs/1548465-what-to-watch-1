import VersionCommand from './cli-command/version-command.js';
import HelpCommand from './cli-command/help-command.js';
import CliApplication from './app/cli-application.js';

const myManager = new CliApplication();
myManager.registerCommands([
  new HelpCommand, new VersionCommand
]);
myManager.processCommand(process.argv);
