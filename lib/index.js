import yargs from 'yargs';

/**
 * Launch CLI
 * @param  {Array} args
 */
export default function cli(args) {
  const program = yargs()
  .version()
  .help('h')
  .commandDir('commands');
  if (!args.length) {
    return program.showHelp();
  }
  return program.parse(args);
}
