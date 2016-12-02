#!/usr/bin/env babel-node

import program from 'commander';
import generate from '../generators';
import serve from '../staging/serve';

program
    .command('new [name]')
    .description('creates new app')
    .action((name) => generate('app', {name}));

program
    .command('serve')
    .alias('s')
    .description('starts dev server')
    .action((name) => serve({source: process.cwd()}));

program.parse(process.argv);
