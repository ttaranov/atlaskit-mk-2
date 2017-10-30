// @flow
import type { Directory, File } from './types';
// $FlowFixMe
import data from 'bolt-fs-loader?{ include: ["docs/**/*.md", "packages/**/docs/**/*.+(js|ts|tsx)", "packages/**/package.json", "packages/**/CHANGELOG.md", "packages/**/examples/**/*.+(js|ts|tsx)", "patterns/**/*.js"], exclude: ["**/node_modules/**", "packages/utils/docs/**"] }!';
import * as fs from './utils/fs';

const siteData: Directory = data;
export default siteData;

const dirs = fs.getDirectories(data.children);

export const docs: Directory = fs.getById(dirs, 'docs');
export const packages: Directory = fs.getById(dirs, 'packages');
export const patterns: Directory = fs.getById(dirs, 'patterns');
