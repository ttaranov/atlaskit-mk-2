// @flow

export function basename(path: string): string {
  return path.split('/').pop();
}

export function join(...args: Array<string>): string {
  return args.filter(Boolean).join('/');
}

export function removeNumericPrefix(path: string): string {
  return path.replace(/^[\d]+-/, '');
}

export function removeSuffix(path: string): string {
  const parts = path.split('.');
  if (parts.length > 1) {
    parts.pop();
  }
  return parts.join('.');
}
