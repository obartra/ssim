#!/usr/bin/env node
/* eslint-disable camelcase */

const fixme = require('fixme');
const _ = require('lodash');
const { join } = require('path');
const { readFileSync } = require('fs');

const eslintIgnores = readFileSync(join(__dirname, '../.eslintignore'), 'utf8').split('\n');
const ignored_directories = _(eslintIgnores)
	.compact()
	.map(str => str.replace(/\/$/, '/**'))
	.value()
	.concat(['dist/**/*', 'node_modules/**/*']);

fixme({
	path: join(__dirname, '../'),
	ignored_directories,
	file_patterns: ['**/*.{js,hbs}']
});
