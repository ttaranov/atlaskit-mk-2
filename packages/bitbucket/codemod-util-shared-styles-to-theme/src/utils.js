// @flow

// Finds the ImportDeclaration from '@atlaskit/util-shared-styles' and
// the child 'akGridSizeUnitless' ImportSpecifier. Returns undefined if
// either are not found, otherwise an array of
// [declaration, specifier, localName]
function getSharedStyles(root: any, j: any) {
  const sharedStylesImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@atlaskit/util-shared-styles',
    },
  });
  if (!sharedStylesImport.size()) {
    return;
  }

  const gridSizeImportSpecifier = sharedStylesImport.find(j.ImportSpecifier, {
    imported: { name: 'akGridSizeUnitless' },
  });
  if (!gridSizeImportSpecifier.size()) {
    return;
  }

  // Find what we are calling akGridSizeUnitless locally
  const localName = gridSizeImportSpecifier.get(0).node.local.name;

  // eslint-disable-next-line consistent-return
  return [sharedStylesImport, gridSizeImportSpecifier, localName];
}

// Converts varName to varName()
function convertVarLiteralToFn(root: any, j: any, varName: string) {
  root
    .find(j.Identifier, {
      name: varName,
    })
    .filter(node => {
      return (
        j(node)
          .closest(j.ImportDeclaration)
          .size() === 0
      );
    })
    .replaceWith(() => j.callExpression(j.identifier(varName), []));
}

// Adds a named import from a package. If the package is already present,
// only the import is added. If the import is also already present, nothing
// is added. If the package is not present, a whole new import line is added.
// Always returns the local name of the import.
function addNamedImport(
  root: any,
  j: any,
  pkg: string,
  importedName: string,
  localName: string,
  otherImport: any,
) {
  const themeImportDeclaration = root.find(j.ImportDeclaration, {
    source: { type: 'Literal', value: pkg },
  });

  // Bail if we've already imported this
  const existingNamedImport = themeImportDeclaration.find(j.ImportSpecifier, {
    imported: { name: importedName },
  });

  if (existingNamedImport.size() > 0) {
    return existingNamedImport.get().node.local.name;
  }

  const importSpecifier = j.importSpecifier(
    j.identifier(importedName),
    j.identifier(localName),
  );
  if (themeImportDeclaration.size()) {
    // Add to the import
    themeImportDeclaration.get(0).node.specifiers.push(importSpecifier);
  } else {
    // Insert a new import
    const s = j.importDeclaration([importSpecifier], j.literal(pkg));
    otherImport.insertAfter(s); // after the imports
  }

  return localName;
}

function removeNamedImport(
  root: any,
  j: any,
  pkg: string,
  importToRemove: string,
  namedImportSpecifier: any,
) {
  // If it's the only import, remove the whole ImportDeclaration (whole line)
  const declaration = root.find(j.ImportDeclaration, {
    source: { type: 'Literal', value: pkg },
  });

  if (declaration.find(j.ImportSpecifier).size() === 1) {
    const getFirstNode = () => root.find(j.Program).get('body', 0).node;

    // Save the comments attached to the first node
    const firstNode = getFirstNode();
    const { comments } = firstNode;

    declaration.remove();

    // If the first node has been modified or deleted, reattach the comments
    const firstNode2 = getFirstNode();
    if (firstNode2 !== firstNode) {
      firstNode2.comments = comments;
    }
  } else {
    namedImportSpecifier.remove();
  }
}

module.exports = {
  getSharedStyles,
  convertVarLiteralToFn,
  addNamedImport,
  removeNamedImport,
};
