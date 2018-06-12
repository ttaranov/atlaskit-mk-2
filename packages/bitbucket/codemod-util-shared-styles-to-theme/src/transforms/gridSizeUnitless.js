// @flow
import { getSharedStyles, addNamedImport, removeNamedImport } from '../utils';

export default function gridSizeUnitless(root: any, j: any) {
  // Check if we import shared styles
  const sharedStylesCollections = getSharedStyles(root, j);
  if (!sharedStylesCollections) {
    return root;
  }
  const [
    sharedStylesImport,
    gridSizeImportSpecifier,
    oldLocalName,
  ] = sharedStylesCollections;

  // There is a chance that gridSize is already imported from akTheme under
  // a different name, so we reassign that here.
  const localName = addNamedImport(
    root,
    j,
    '@atlaskit/theme',
    'gridSize',
    oldLocalName,
    sharedStylesImport,
  );

  root
    .find(j.Identifier, {
      name: oldLocalName,
    })
    .filter(node => {
      return (
        j(node)
          .closest(j.ImportDeclaration)
          .size() === 0
      );
    })
    .filter(node => {
      return (
        j(node)
          .closest(j.CallExpression)
          .size() === 0
      );
    })
    .replaceWith(() => j.callExpression(j.identifier(localName), []));

  removeNamedImport(
    root,
    j,
    '@atlaskit/util-shared-styles',
    'akGridSizeUnitless',
    gridSizeImportSpecifier,
  );

  return root;
}
