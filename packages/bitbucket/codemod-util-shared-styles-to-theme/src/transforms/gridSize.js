// @flow

import { addNamedImport, removeNamedImport } from '../utils';

export default function gridSize(root: any, j: any) {
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

  const importSpecifier = sharedStylesImport.find(j.ImportSpecifier, {
    imported: { name: 'akGridSize' },
  });
  if (!importSpecifier.size()) {
    return root;
  }

  // Find what we are calling akGridSizeUnitless locally
  let localName = importSpecifier.get(0).node.local.name;

  // There is a chance that gridSize is already imported from akTheme under
  // a different name, so we reassign that here.
  localName = addNamedImport(
    root,
    j,
    '@atlaskit/theme',
    'gridSize',
    localName,
    sharedStylesImport,
  );

  // Convert uses of the old akBorderRadius to template `${akBorderRadius()}px`
  root
    .find(j.Identifier, {
      name: localName,
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
    .replaceWith(() =>
      j.templateLiteral(
        [
          j.templateElement({ cooked: '', raw: '' }, false),
          j.templateElement({ cooked: 'px', raw: 'px' }, true),
        ],
        [j.callExpression(j.identifier(localName), [])],
      ),
    );

  // Fix up double-templated gridSize calls
  root
    .find(j.Identifier, { name: localName })
    .filter(node => {
      const n = j(node);
      const isInsideTemplateLiteral =
        n
          .closest(j.TemplateLiteral)
          .closest(j.TemplateLiteral)
          .size() > 0;
      return isInsideTemplateLiteral;
    })
    .forEach(node => {
      const n = j(node);
      const parentTemplateLiteral = n.closest(j.TemplateLiteral);
      const grandparentTemplateLiteral = parentTemplateLiteral.closest(
        j.TemplateLiteral,
      );

      const indexOfParentLiteral = grandparentTemplateLiteral
        .get()
        .node.expressions.findIndex(subNode => {
          return (
            subNode.type === 'TemplateLiteral' &&
            subNode.expressions &&
            subNode.expressions.length &&
            subNode.expressions[0].callee.name === localName
          );
        });

      if (
        grandparentTemplateLiteral.get().node.quasis.length >=
        indexOfParentLiteral + 1
      ) {
        // console.log(endOfLine);
        const endOfLine = grandparentTemplateLiteral.get().node.quasis[
          indexOfParentLiteral + 1
        ];
        endOfLine.value.raw = `px${endOfLine.value.raw}`;
        endOfLine.value.cooked = `px${endOfLine.value.cooked}`;
      }

      n.closest(j.TemplateLiteral).replaceWith(
        j.callExpression(j.identifier(localName), []),
      );
    });

  removeNamedImport(
    root,
    j,
    '@atlaskit/util-shared-styles',
    'akGridSize',
    importSpecifier,
  );

  return root;
}
