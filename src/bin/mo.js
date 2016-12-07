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
    .description('run specific generator (ex. `mo g page Home`)')
    .action((target, name) => generate(target, {name}));

program
    .command('serve')
    .alias('s')
    .option('-p, --port [port]', 'express.js port (defaults to 7777)')
    .description('start dev server (ex. `mo s`)')
    .action((options) => serve({
        source: process.cwd(),
        port: options.port
    }));

program
    .version(version)
    .parse(process.argv);
