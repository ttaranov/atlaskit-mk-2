// @flow
import { addNamedImport } from '../utils';

const colorMappings = {
  akColorPrimary1: 'colors.N800',
  akColorPrimary2: 'colors.B500',
  akColorPrimary3: 'colors.N0',
  akColorSecondary1: 'colors.R300',
  akColorSecondary2: 'colors.Y300',
  akColorSecondary3: 'colors.G300',
  akColorSecondary4: 'colors.P300',
  akColorSecondary5: 'colors.T300',
  akColorR50: 'colors.R50',
  akColorR75: 'colors.R75',
  akColorR100: 'colors.R100',
  akColorR200: 'colors.R200',
  akColorR300: 'colors.R300',
  akColorR400: 'colors.R400',
  akColorR500: 'colors.R500',
  akColorY50: 'colors.Y50',
  akColorY75: 'colors.Y75',
  akColorY100: 'colors.Y100',
  akColorY200: 'colors.Y200',
  akColorY300: 'colors.Y300',
  akColorY400: 'colors.Y400',
  akColorY500: 'colors.Y500',
  akColorG50: 'colors.G50',
  akColorG75: 'colors.G75',
  akColorG100: 'colors.G100',
  akColorG200: 'colors.G200',
  akColorG300: 'colors.G300',
  akColorG400: 'colors.G400',
  akColorG500: 'colors.G500',
  akColorB50: 'colors.B50',
  akColorB75: 'colors.B75',
  akColorB100: 'colors.B100',
  akColorB200: 'colors.B200',
  akColorB300: 'colors.B300',
  akColorB400: 'colors.B400',
  akColorB500: 'colors.B500',
  akColorP50: 'colors.P50',
  akColorP75: 'colors.P75',
  akColorP100: 'colors.P100',
  akColorP200: 'colors.P200',
  akColorP300: 'colors.P300',
  akColorP400: 'colors.P400',
  akColorP500: 'colors.P500',
  akColorT50: 'colors.T50',
  akColorT75: 'colors.T75',
  akColorT100: 'colors.T100',
  akColorT200: 'colors.T200',
  akColorT300: 'colors.T300',
  akColorT400: 'colors.T400',
  akColorT500: 'colors.T500',
  akColorN0: 'colors.N0',
  akColorN10: 'colors.N10',
  akColorN20: 'colors.N20',
  akColorN30: 'colors.N30',
  akColorN40: 'colors.N40',
  akColorN50: 'colors.N50',
  akColorN60: 'colors.N60',
  akColorN70: 'colors.N70',
  akColorN80: 'colors.N80',
  akColorN90: 'colors.N90',
  akColorN100: 'colors.N100',
  akColorN200: 'colors.N200',
  akColorN300: 'colors.N300',
  akColorN400: 'colors.N400',
  akColorN500: 'colors.N500',
  akColorN600: 'colors.N600',
  akColorN700: 'colors.N700',
  akColorN800: 'colors.N800',
  akColorN900: 'colors.N900',
  akColorN10A: 'colors.N10A',
  akColorN20A: 'colors.N20A',
  akColorN30A: 'colors.N30A',
  akColorN40A: 'colors.N40A',
  akColorN50A: 'colors.N50A',
  akColorN60A: 'colors.N60A',
  akColorN70A: 'colors.N70A',
  akColorN80A: 'colors.N80A',
  akColorN90A: 'colors.N90A',
  akColorN100A: 'colors.N100A',
  akColorN200A: 'colors.N200A',
  akColorN300A: 'colors.N300A',
  akColorN400A: 'colors.N400A',
  akColorN500A: 'colors.N500A',
  akColorN600A: 'colors.N600A',
  akColorN700A: 'colors.N700A',
  akColorN800A: 'colors.N800A',
};

export default function colorTransform(root: any, j: any) {
  // Check if we import shared styles
  const sharedStylesImport = root.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: '@atlaskit/util-shared-styles',
    },
  });
  if (!sharedStylesImport) {
    return root;
  }

  // Find named color imports
  const colorImportSpecifiers = sharedStylesImport
    .find(j.ImportSpecifier)
    .filter(spec =>
      Object.keys(colorMappings).includes(spec.node.imported.name),
    );

  // If not util shared style colors, bail
  if (!colorImportSpecifiers.size()) {
    return root;
  }

  // Create a cache of the imported names, so we can remove them from the root
  const importedColors = [];
  colorImportSpecifiers.forEach(spec => {
    importedColors.push({
      local: spec.node.local.name,
      imported: spec.node.imported.name,
    });
  });

  colorImportSpecifiers.remove();

  // Convert the colors usage to colors.*
  importedColors.forEach(spec => {
    root
      .find(j.Identifier, {
        name: spec.local,
      })
      .replaceWith(() => j.identifier(colorMappings[spec.imported]));
  });

  // Add an import of colors from @atlaskit/theme
  addNamedImport(
    root,
    j,
    '@atlaskit/theme',
    'colors',
    'colors',
    sharedStylesImport,
  );

  // Remove util shared styles if no named imports
  if (sharedStylesImport.find(j.ImportSpecifier).size() === 0) {
    sharedStylesImport.remove();
  }

  return root;
}
