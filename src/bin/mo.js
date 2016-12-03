#!/usr/bin/env node

import program from 'commander';
import generate from '../generators';
import serve from '../server/serve';
import {version} from '../../package.json';

program
    .command('new [name]')
    .description('creates new app')
    .action((name) => generate('app', {name}));

program
    .command('serve')
    .alias('s')
    .description('starts dev server')
    .action((name) => serve({source: process.cwd()}));

program
    .version(version)
    .parse(process.argv);
