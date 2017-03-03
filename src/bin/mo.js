#!/usr/bin/env node

import program from 'commander';
import generate from '../generators';
import serve from '../server/serve';
import {version} from '../../package.json';

program
    .command('new [name]')
    .description('create new app')
    .action((name) => generate('app', {name}));

program
    .command('generate [target] [name]')
    .alias('g')
    .option('-f, --force', 'overwrite existing folders')
    .description('run specific generator (ex. `mo g page Home`)')
    .action((target, name, options={}) => generate(target, {name, options}));

program
    .command('serve')
    .alias('s')
    .option('-p, --port [port]', 'express.js port (defaults to 7777)')
    .allowUnknownOption()
    .description('start dev server (ex. `mo s`)')
    .action((options) => serve({
        source: process.cwd(),
        port: options.port
    }));

program
    .description('Run `mo [command] -h` to show command options')
    .version(version)
    .parse(process.argv);
