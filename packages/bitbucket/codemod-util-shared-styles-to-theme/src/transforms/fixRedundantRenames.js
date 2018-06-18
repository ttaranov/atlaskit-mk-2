// @flow

export default function redundantNames(root: any, j: any) {
  root
    .find(j.ImportDeclaration, {
      source: {
        type: 'Literal',
        value: '@atlaskit/theme',
      },
    })
    .find(j.ImportSpecifier)
    .filter(node => {
      // Filter renamed imports
      const n = node.get().value;
      return n.imported.name !== n.local.name;
    })
    .filter(node => {
      // Filter imports where true import name is unused in document
      const n = node.get().value;
      return root.find(j.Identifier, { name: n.imported.name }).size() <= 1;
    })
    .replaceWith(nodePath => {
      const importedName = nodePath.node.imported.name;
      root
        .find(j.Identifier, { name: nodePath.node.local.name })
        .replaceWith(j.identifier(importedName));
      return j.importSpecifier(
        j.identifier(importedName),
        j.identifier(importedName),
      );
    });

  return root;
}
