// @flow

import data from './DESIGN_SITE_DATA';
import * as fs from './utils/fs';

const siteData = data;
export default siteData;

const dirs = fs.getDirectories(data.children);
export const packages: Directory = fs.getById(dirs, 'packages');
