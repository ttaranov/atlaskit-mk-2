// @flow
export function isModuleNotFoundError(e, pkgId) {
  const a = new RegExp(`^Missing ${pkgId} in file system`);
  console.log(pkgId, a, e);

  return e.message.indexOf('Cannot find module') > -1 || a.test(e.message);
}
