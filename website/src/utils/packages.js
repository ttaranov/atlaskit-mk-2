// @flow
import { EXAMPLES, PACKAGES } from '../constants';

export function getUnscopedPkgName(name: string) {
  if (name.indexOf('@') === 0) {
    return name.split('/')[1];
  }
  return name;
}

export function getPackageByGroupAndName(group: string, name: string) {
  // $FlowFixMe
  return PACKAGES[group].find(pkg => pkg.name === name);
}

export function getWorkspace(name: string) {
  return EXAMPLES.data.workspaces.filter(w => new RegExp(`/${name}$`).test(w.dir))[0];
}
