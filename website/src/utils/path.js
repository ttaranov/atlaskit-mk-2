// @flow

export function basename(path: string) {
  return path.split('/').pop();
}

export function removeNumericPrefix(path: string) {
  return path.replace(/^[\d]+-/, '');
}

export function removeSuffix(path: string) {
  return path.replace('.js', '');
}

export function formatCodeImports(packageName: string, code: string) {
  return code.replace(/\.\.\/src/g, packageName);
}
