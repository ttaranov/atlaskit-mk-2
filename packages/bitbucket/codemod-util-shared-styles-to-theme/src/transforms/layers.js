//@flow
import { addNamedImport } from '../utils';

const LayerMapping = {
  akZIndexCard: 'card',
  akZIndexDialog: 'dialog',
  akZIndexNavigation: 'navigation',
  akZIndexLayer: 'layer',
  akZIndexBlanket: 'blanket',
  akZIndexModal: 'modal',
  akZIndexFlag: 'flag',
};

export default function Layers(root: any, j: any) {
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

  // Find named layer imports
  const layerImportSpecifiers = sharedStylesImport
    .find(j.ImportSpecifier)
    .filter(spec =>
      Object.keys(LayerMapping).includes(spec.node.imported.name),
    );

  // If not util shared style colors, bail
  if (!layerImportSpecifiers.size()) {
    return root;
  }

  // Create a cache of the imported names, so we can remove them from the root
  const importedLayers = [];
  layerImportSpecifiers.forEach(spec => {
    importedLayers.push({
      local: spec.node.local.name,
      imported: spec.node.imported.name,
    });
  });

  layerImportSpecifiers.remove();

  importedLayers.forEach(spec => {
    root
      .find(j.Identifier, {
        name: spec.local,
      })
      .replaceWith(() =>
        j.callExpression(
          j.memberExpression(
            j.identifier('layers'),
            j.identifier(LayerMapping[spec.imported]),
          ),
          [],
        ),
      );
  });

  // Add an import of colors from @atlaskit/theme
  addNamedImport(
    root,
    j,
    '@atlaskit/theme',
    'layers',
    'layers',
    sharedStylesImport,
  );

  //Remove util shared styles if no named imports
  if (sharedStylesImport.find(j.ImportSpecifier).size() === 0) {
    sharedStylesImport.remove();
  }

  return root;
}
