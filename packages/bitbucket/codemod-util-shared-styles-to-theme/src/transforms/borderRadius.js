// @flow
import { addNamedImport, removeNamedImport } from '../utils';

export default function borderRadius(root: any, j: any) {
  // Check if we import shared styles
  const sharedStylesImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@atlaskit/util-shared-styles',
    },
  });
  if (!sharedStylesImport.size()) {
    return root;
  }

  const borderRadiusImportSpecifier = sharedStylesImport.find(
    j.ImportSpecifier,
    {
      imported: { name: 'akBorderRadius' },
    },
  );
  if (!borderRadiusImportSpecifier.size()) {
    return root;
  }

  // Find what we are calling akGridSizeUnitless locally
  const localName = borderRadiusImportSpecifier.get(0).node.local.name;

  // Convert uses of the old akBorderRadius to template `${akBorderRadius()}px`
  root
    .find(j.Identifier, {
      name: localName,
    })
    .replaceWith(() =>
      j.templateLiteral(
        [
          j.templateElement({ cooked: '', raw: '' }, false),
          j.templateElement({ cooked: 'px', raw: 'px' }, true),
        ],
        [j.callExpression(j.identifier(localName), [])],
      ),
    );

  addNamedImport(
    root,
    j,
    '@atlaskit/theme',
    'borderRadius',
    localName,
    sharedStylesImport,
  );
  removeNamedImport(
    root,
    j,
    '@atlaskit/util-shared-styles',
    'akBorderRadius',
    borderRadiusImportSpecifier,
  );

  return root;
}
