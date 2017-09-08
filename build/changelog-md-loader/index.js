// @flow
'use strict';

function getChangeLog(changelog) {
  const splitToken = `__CHANGELOG_SPLIT_${Date.now()}__`;
  const toReturn = changelog
  ? changelog
    .replace(/## /g, `${splitToken}## `)
    .split(splitToken)
    .map((md) => {
      // This should only allow us to skip the first chunk which is the name, as
      // well as the unreleased section.
      const version = md.match(/\d+\.\d+\.\d+/) ? md.match(/\d+\.\d+\.\d+/)[0] : null;
      if (!version) return null;
      return {
        version,
        md,
      };
    })
    .filter(t => t)
  : [''];
  return toReturn;
}

module.exports = function loader(markdown) {
  // merge params and default config
  this.cacheable();

  const changelog = getChangeLog(markdown);
  console.log('Loading', markdown);

  return `module.exports = ${JSON.stringify(changelog)}`;
};
