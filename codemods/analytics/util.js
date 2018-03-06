/**
 * This module contains some general helper functions related to analytics
 */
import fs from 'fs';
import path from 'path';
import { analyticsEventMap } from './analyticsEventMap';

export const getMapEntryFromPath = (filepath, configKey) => (
  analyticsEventMap.find(eventConfig => (
    filepath.indexOf(eventConfig[configKey]) > -1
  ))
);

export const getPackageJsonPath = (filepath) => {
  let foundPackageJson = false;
  let curDir = filepath;
  if (filepath.indexOf('codemods') >= 0) {
    // Hardcode package.json path for tests
    return '../../package.json';
  }

  while (!foundPackageJson || curDir === '/') {
    curDir = path.resolve(curDir, '..');
    const parentDirContents = fs.readdirSync(curDir);
    foundPackageJson = !!(parentDirContents.find(file => file === 'package.json'));
    if (!foundPackageJson && !!(parentDirContents.find(file => file === 'package.json'))) {
      break;
    }
  }

  // path.relative only works correctly on directories...
  const packageJsonPath = foundPackageJson
    ? path.join(path.relative(path.dirname(filepath), curDir), 'package.json')
    : 'could/not/find/package.json';

  return packageJsonPath;
}