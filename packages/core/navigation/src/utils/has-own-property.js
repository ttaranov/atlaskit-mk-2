// @flow
// flowlint-next-line unclear-type:off
export default (obj: Object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key);
