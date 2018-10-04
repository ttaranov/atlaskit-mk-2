// @flow
const SVGO = require('svgo');

const preventFocusing = require('./plugins/preventFocusing');
const addRoleAttribute = require('./plugins/addRoleAttribute');
const callbackOnDefinedFill = require('./plugins/callbackOnDefinedFill');
const callbackOnStyleElement = require('./plugins/callbackOnStyleElement');
const replaceIDs = require('./plugins/replaceIDs');

module.exports = () => {
  const initialiseCustomSVGO = filename => {
    const callbackOnDefinedFillPlugin = Object.assign(
      {},
      callbackOnDefinedFill,
      {
        params: Object.assign({}, callbackOnDefinedFill.params, {
          callback: fill => {
            // file-types and objects are colored icons
            if (
              fill.toString().startsWith('#') &&
              !(filename.includes('file-types') || filename.includes('objects'))
            )
              console.warn(`"${filename}": has a fill of "${fill}"`);
          },
        }),
      },
    );

    return new SVGO({
      full: true,
      plugins: [
        { preventFocusing },
        { addRoleAttribute },
        { replaceIDs },
        { callbackOnDefinedFillPlugin },
        { callbackOnStyleElement },
        { removeStyleElement: true },
      ],
    });
  };

  const optimiseSVG /*: (string, string) => Promise<*> */ = (
    filename,
    data,
  ) => {
    const customSVGO = initialiseCustomSVGO(filename);

    // Run the default optimiser on the SVG
    return new Promise(resolve => customSVGO.optimize(data, resolve));
  };
  return optimiseSVG;
};

// const optimiseSVG /*: (string, string) => Promise<*> */ = (
//   filename,
//   data,
// ) => {
//   const customSVGO = initialiseCustomSVGO(filename);
//
//   // Run the default optimiser on the SVG
//   return new Promise(resolve => customSVGO.optimize(data, resolve));
// };
// return optimiseSVG;
