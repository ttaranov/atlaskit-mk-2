// @flow
import gridSizeTransform from './transforms/gridSize';
import gridSizeUnitlessTransform from './transforms/gridSizeUnitless';
import colorTransform from './transforms/color';
import borderRadiusTransform from './transforms/borderRadius';
import typographyTransform from './transforms/typography';
import codeFontTransform from './transforms/codeFont';
import fixRedundantRenamesTransform from './transforms/fixRedundantRenames';
import fontSize from './transforms/fontSize';
import fontFamily from './transforms/fontFamily';
import layers from './transforms/layers';

// This function gets called by jscodeshift.
// It gets passed the file info and a reference to the jscodeshift API.
export default function utilSharedStylesToThemeCodeshift(
  fileInfo: any,
  api: any,
) {
  const { jscodeshift: j } = api;
  const root = j(fileInfo.source);

  const transforms = [
    fontFamily,
    gridSizeTransform,
    gridSizeUnitlessTransform,
    colorTransform,
    borderRadiusTransform,
    typographyTransform,
    codeFontTransform,
    fontSize,
    layers,
    fixRedundantRenamesTransform,
  ];

  let transformed = root;
  transforms.forEach(transform => {
    transformed = transform(transformed, j);
  });

  return transformed.toSource({ quote: 'double' });
}
