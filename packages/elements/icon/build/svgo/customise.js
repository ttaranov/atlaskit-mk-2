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
          callback: fill =>
            console.warn(`"${filename}": has a fill of "${fill}"`),
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

  return (filename /*: string*/, data /*: string*/ /*: Promise<*>*/) => {
    const customSVGO = initialiseCustomSVGO(filename);

    // Run the default optimiser on the SVG
    return new Promise(resolve => customSVGO.optimize(data, resolve));
  };
};
