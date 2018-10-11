// @flow
const SVGO = require('svgo');

const removeNamespacedAttributes = require('./plugins/removeNamespacedAttributes');
const replaceSketchHexColors = require('./plugins/replaceSketchHexColors');

module.exports = (config /*: { maxWidth: number, maxHeight: number }*/) => {
  const initialiseDefaultSVGO = () =>
    new SVGO({
      multipass: true,
      plugins: [
        { removeTitle: true },
        { removeDesc: { removeAny: true } },
        { cleanupIDs: true },
        { collapseGroups: true },
        { removeXMLNS: true },
        { removeNamespacedAttributes },
        { replaceSketchHexColors },
      ],
    });

  const defaultSVGO = initialiseDefaultSVGO();

  const cleanSVGO /*: (string, string) => Promise<{ info: any, data: any }> */ = (
    filename,
    rawSVG,
  ) => {
    // Run the default optimiser on the SVG
    return (
      new Promise(resolve => defaultSVGO.optimize(rawSVG, resolve))
        // Check width and height
        .then(({ info, data }) => {
          if (info.width > config.maxWidth) {
            console.warn(
              `"${filename}" too wide: ${info.width} > ${config.maxWidth}`,
            );
          }
          if (info.height > config.maxHeight) {
            console.warn(
              `"${filename}" too wide: ${info.height} > ${config.maxHeight}`,
            );
          }
          return { info, data };
        })
    );
  };
  return cleanSVGO;
};
