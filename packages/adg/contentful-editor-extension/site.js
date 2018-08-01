// @flow

import data from './src/DESIGN_SITE_DATA';
import * as fs from './src/utils/fs';

const siteData = data;
export default siteData;

const dirs = fs.getDirectories(data.children);
export const packages: Directory = fs.getById(dirs, 'packages');
