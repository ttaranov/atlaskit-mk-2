// @flow
import type { Directory, File } from './types';

// SITE_DATA is dynamically generated at runtime by bolt-fs-loader.
// Configuration for bolt-fs-loader is in webpack.config.js since it needs to be dynamically created
// depending on the subset of packages we want to represent on the website.
// $FlowFixMe
import data from './SITE_DATA';
import * as fs from './utils/fs';

const siteData: Directory = data;
export default siteData;

const dirs = fs.getDirectories(data.children);

export const docs: Directory = fs.getById(dirs, 'docs');
export const packages: Directory = fs.getById(dirs, 'packages');
export const patterns: Directory = fs.maybeGetById(dirs, 'patterns') || {
  id: 'patterns',
  type: 'dir',
  children: [],
};
