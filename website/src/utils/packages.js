// @flow
import { PACKAGES } from '../constants';

export function getUnscopedPkgName(name: string) {
  if (name.indexOf('@') === 0) {
    return name.split('/')[1];
  }
  return name;
}

export function getPackageByGroupAndName(group: string, name: string) {
  return PACKAGES[group].find(pkg => pkg.name === name);
}
