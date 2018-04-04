/**
 * This module contains some general helper functions related to analytics
 */
import fs from 'fs';
import path from 'path';
import { analyticsEventMap } from '../../packages/core/analytics-next/analyticsEventMap';

export const getMapEntryFromPath = (filepath, configKey) => (
  analyticsEventMap.find(eventConfig => (
    filepath.indexOf(eventConfig[configKey]) > -1 && eventConfig.ignore !== true
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

export const getRelativeComponentPath = (analyticsEventConfig) => {
  return path.join(
    path.relative(path.dirname(analyticsEventConfig.testPath), path.dirname(analyticsEventConfig.path)),
    path.basename(analyticsEventConfig.path, '.js')
  );
}
