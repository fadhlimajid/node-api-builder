#!/usr/bin/env node

const [,, ...args] = process.argv;
const command = require(`../lib`)[args[0]];

command();
