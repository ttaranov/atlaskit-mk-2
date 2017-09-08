// @flow
import { PACKAGES } from '../constants';

export function getUnscopedPkgName(name: string) {
  if (name.indexOf('@') === 0) {
    return name.split('/')[1];
  }
  return name;
}

export function getPackageByUnscopedName(name: string) {
  return PACKAGES.find(pkg => getUnscopedPkgName(pkg.name) === name);
}

export function getExamplesForUnscopedPackage(name: string) {
  const reqCtx = require.context('../../../components/', true, /^\.\/[\w\d-_]+\/examples\/.*\.js$/);
  return reqCtx(`./${name}/examples`);
}
