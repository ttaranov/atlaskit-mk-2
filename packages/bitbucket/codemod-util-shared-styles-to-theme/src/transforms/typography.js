// @flow
import { addNamedImport, removeNamedImport } from '../utils';

export default function gridSizeUnitlessTransform(root: any, j: any) {
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

  const typogImportSpecifier = sharedStylesImport.find(j.ImportSpecifier, {
    imported: { name: 'akTypographyMixins' },
  });
  if (!typogImportSpecifier.size()) {
    return root;
  }

  // Find what we are calling akGridSizeUnitless locally
  const localName = typogImportSpecifier.get(0).node.local.name;

  root
    .find(j.MemberExpression, {
      object: {
        type: 'Identifier',
        name: localName,
      },
    })
    .replaceWith(nodePath => {
      return j.memberExpression(
        j.identifier(localName),
        j.callExpression(j.identifier(nodePath.value.property.name), []),
      );
    });

  addNamedImport(
    root,
    j,
    '@atlaskit/theme',
    'typography',
    localName,
    sharedStylesImport,
  );
  removeNamedImport(
    root,
    j,
    '@atlaskit/util-shared-styles',
    'akTypographyMixins',
    typogImportSpecifier,
  );

  return root;
}
