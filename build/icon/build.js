// @flow
const babel = require('@babel/core');
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const getCleanSVGFunction = require('./svgo/clean');
const customiseSVG = require('./svgo/customise')();
const glyphTemplate = require('./glyph.template');
const tsTemplate = require('./typescript.template');

/*::
type Config = {
  srcDir: string,
  processedDir: string,
  destDir: string,
  glob: string,
  maxWidth: number,
  maxHeight: number,
  size?: string
};
*/

module.exports = function(config /*: Config */) {
  const cleanSVG = getCleanSVGFunction(config);
  console.log('Processing icon glyphs.');

  // Read the contents of the source directory
  let files = glob.sync(config.glob, { cwd: config.srcDir });

  return (
    Promise.all(
      files.map(filepath => {
        const wayHome = filepath
          .split('/')
          .map(a => '..')
          .concat('cjs/index')
          .join('/');
        const fileKey = filepath.replace(/\.svg$/, '');
        const displayName = fileKey
          .split(/\W/)
          .map(part => `${part[0].toUpperCase()}${part.slice(1)}`)
          .join('')
          .concat('Icon');

        // Read the contents of the SVG file
        return (
          fs
            .readFile(path.join(config.srcDir, filepath))
            // Optimise the SVG
            .then(rawSVG => cleanSVG(filepath, rawSVG))
            .then(({ data: optimisedSVG }) => {
              // saved the optimised SVGs to disk for reduced-ui-pack
              return (
                fs
                  .outputFile(
                    path.join(config.processedDir, filepath),
                    optimisedSVG,
                  )
                  // customise the SVG to make it JSX ready
                  .then(() => customiseSVG(filepath, optimisedSVG))

                  // wrap the optimised SVGs in the JS module
                  .then(({ data: customisedSVG }) =>
                    glyphTemplate(
                      customisedSVG,
                      displayName,
                      wayHome,
                      config.size,
                    ),
                  )
              );
            })
            // Transpile the component code
            .then(componentCode =>
              babel.transform(componentCode, {
                presets: ['@babel/env', '@babel/react', '@babel/flow'],
              }),
            )
            .then(({ code }) =>
              fs.outputFile(path.join(config.destDir, `${fileKey}.js`), code),
            )
            // Write the TypeScript file
            .then(() =>
              fs.outputFile(
                path.join(config.destDir, `${fileKey}.d.ts`),
                tsTemplate,
              ),
            )
            // Return the filename and display name
            .then(() => ({ fileKey, displayName }))
          // .catch(err => console.error(err))
        );
      }),
    )
      // Generate icon documentation data
      .then(icons => {
        console.log('\n 📦  Icons sorted.');
        return icons;
      })
      .catch(err => console.error(err))
  );
};

module.exports;
