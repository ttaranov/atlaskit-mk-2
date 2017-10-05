export function isModuleNotFoundError(e) {
  return (e.message.indexOf('Cannot find module') > -1);
}
