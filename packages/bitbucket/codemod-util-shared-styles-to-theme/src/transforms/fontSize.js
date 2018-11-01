//@flow
import { addNamedImport, removeNamedImport } from '../utils';

export default function fontSizeTransformation(root: any, j: any) {
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

  const codeFontImportSpecifier = sharedStylesImport.find(j.ImportSpecifier, {
    imported: { name: 'akFontSizeDefault' },
  });
  if (!codeFontImportSpecifier.size()) {
    return root;
  }

  // Find what we are calling akGridSizeUnitless locally
  const localName = codeFontImportSpecifier.get(0).node.local.name;

  // Convert uses of the old akCodeFontFamily to template `${akCodeFontFamily()}px`
  root
    .find(j.Identifier, {
      name: localName,
    })
    .replaceWith(() =>
      j.binaryExpression(
        '+',
        j.callExpression(j.identifier(localName), []),
        j.literal('px'),
      ),
    );

  addNamedImport(
    root,
    j,
    '@atlaskit/theme',
    'fontSize',
    localName,
    sharedStylesImport,
  );
  removeNamedImport(
    root,
    j,
    '@atlaskit/util-shared-styles',
    'akFontSizeDefault',
    codeFontImportSpecifier,
  );

  return root;
}
