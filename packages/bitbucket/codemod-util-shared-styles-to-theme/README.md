# codemod-util-shared-styles-to-theme

Codemod for converting `@atlaskit/util-shared-styles` to `@atlaskit/theme`

## Transformations

### Supported

- `akGridSizeUnitless` > `gridSize()`
- `akColorN50` > `colors.N50`
- `akBorderRadius` > `borderRadius()`
- `akTypographyMixins.h100` > `typography.h100()`
- `akGridSize` > `` `${akGridSize()}px` ``
- `akCodeFontFamily` > `codeFontFamily()`
- `akFontFamily` > `fontFamily()`
- `akFontSizeDefault` > `` `${fontSize()}px`
- `akZIndexXYZ` > `layers.XYZ()`

### Not supported yet

PRs welcome :)

- `akHelperMixins` > ?

## Setup

```
yarn install
```

## Development and testing

```
bolt test packages/bitbucket/codemod-util-shared-styles-to-theme
```

## Running codemods on real code

```
yarn jscodeshift \
  -t dist/index.js \
  --ignore-pattern node_modules \
  ~/Repos/bitbucket/bitkit \
  --extensions js,jsx \
  --parser flow
```

## Mapping of util-shared-styles to theme

| @atlaskit/util-shared-styles       | type     | @atlaskit/theme   | type     | Notes                   |
| ---------------------------------- | -------- | ----------------- | -------- | ----------------------- |
| akBorderRadius                     | string   | borderRadius      | function | old '3px' new () => 3   |
| akColorPrimary1                    | string   | colors.N800       | string   |                         |
| akColorPrimary2                    | string   | colors.B500       | string   |                         |
| akColorPrimary3                    | string   | colors.N0         | string   |                         |
| akColorSecondary1                  | string   | colors.R300       | string   |                         |
| akColorSecondary2                  | string   | colors.Y300       | string   |                         |
| akColorSecondary3                  | string   | colors.G300       | string   |                         |
| akColorSecondary4                  | string   | colors.P300       | string   |                         |
| akColorSecondary5                  | string   | colors.T300       | string   |                         |
| akColorR50                         | string   | colors.R50        | string   |                         |
| akColorR75                         | string   | colors.R75        | string   |                         |
| akColorR100                        | string   | colors.R100       | string   |                         |
| akColorR200                        | string   | colors.R200       | string   |                         |
| akColorR300                        | string   | colors.R300       | string   |                         |
| akColorR400                        | string   | colors.R400       | string   |                         |
| akColorR500                        | string   | colors.R500       | string   |                         |
| akColorY50                         | string   | colors.Y50        | string   |                         |
| akColorY75                         | string   | colors.Y75        | string   |                         |
| akColorY100                        | string   | colors.Y100       | string   |                         |
| akColorY200                        | string   | colors.Y200       | string   |                         |
| akColorY300                        | string   | colors.Y300       | string   |                         |
| akColorY400                        | string   | colors.Y400       | string   |                         |
| akColorY500                        | string   | colors.Y500       | string   |                         |
| akColorG50                         | string   | colors.G50        | string   |                         |
| akColorG75                         | string   | colors.G75        | string   |                         |
| akColorG100                        | string   | colors.G100       | string   |                         |
| akColorG200                        | string   | colors.G200       | string   |                         |
| akColorG300                        | string   | colors.G300       | string   |                         |
| akColorG400                        | string   | colors.G400       | string   |                         |
| akColorG500                        | string   | colors.G500       | string   |                         |
| akColorB50                         | string   | colors.B50        | string   |                         |
| akColorB75                         | string   | colors.B75        | string   |                         |
| akColorB100                        | string   | colors.B100       | string   |                         |
| akColorB200                        | string   | colors.B200       | string   |                         |
| akColorB300                        | string   | colors.B300       | string   |                         |
| akColorB400                        | string   | colors.B400       | string   |                         |
| akColorB500                        | string   | colors.B500       | string   |                         |
| akColorP50                         | string   | colors.P50        | string   |                         |
| akColorP75                         | string   | colors.P75        | string   |                         |
| akColorP100                        | string   | colors.P100       | string   |                         |
| akColorP200                        | string   | colors.P200       | string   |                         |
| akColorP300                        | string   | colors.P300       | string   |                         |
| akColorP400                        | string   | colors.P400       | string   |                         |
| akColorP500                        | string   | colors.P500       | string   |                         |
| akColorT50                         | string   | colors.T50        | string   |                         |
| akColorT75                         | string   | colors.T75        | string   |                         |
| akColorT100                        | string   | colors.T100       | string   |                         |
| akColorT200                        | string   | colors.T200       | string   |                         |
| akColorT300                        | string   | colors.T300       | string   |                         |
| akColorT400                        | string   | colors.T400       | string   |                         |
| akColorT500                        | string   | colors.T500       | string   |                         |
| akColorN0                          | string   | colors.N0         | string   |                         |
| akColorN10                         | string   | colors.N10        | string   |                         |
| akColorN20                         | string   | colors.N20        | string   |                         |
| akColorN30                         | string   | colors.N30        | string   |                         |
| akColorN40                         | string   | colors.N40        | string   |                         |
| akColorN50                         | string   | colors.N50        | string   |                         |
| akColorN60                         | string   | colors.N60        | string   |                         |
| akColorN70                         | string   | colors.N70        | string   |                         |
| akColorN80                         | string   | colors.N80        | string   |                         |
| akColorN90                         | string   | colors.N90        | string   |                         |
| akColorN100                        | string   | colors.N100       | string   |                         |
| akColorN200                        | string   | colors.N200       | string   |                         |
| akColorN300                        | string   | colors.N300       | string   |                         |
| akColorN400                        | string   | colors.N400       | string   |                         |
| akColorN500                        | string   | colors.N500       | string   |                         |
| akColorN600                        | string   | colors.N600       | string   |                         |
| akColorN700                        | string   | colors.N700       | string   |                         |
| akColorN800                        | string   | colors.N800       | string   |                         |
| akColorN900                        | string   | colors.N900       | string   |                         |
| akColorN10A                        | string   | colors.N10A       | string   |                         |
| akColorN20A                        | string   | colors.N20A       | string   |                         |
| akColorN30A                        | string   | colors.N30A       | string   |                         |
| akColorN40A                        | string   | colors.N40A       | string   |                         |
| akColorN50A                        | string   | colors.N50A       | string   |                         |
| akColorN60A                        | string   | colors.N60A       | string   |                         |
| akColorN70A                        | string   | colors.N70A       | string   |                         |
| akColorN80A                        | string   | colors.N80A       | string   |                         |
| akColorN90A                        | string   | colors.N90A       | string   |                         |
| akColorN100A                       | string   | colors.N100A      | string   |                         |
| akColorN200A                       | string   | colors.N200A      | string   |                         |
| akColorN300A                       | string   | colors.N300A      | string   |                         |
| akColorN400A                       | string   | colors.N400A      | string   |                         |
| akColorN500A                       | string   | colors.N500A      | string   |                         |
| akColorN600A                       | string   | colors.N600A      | string   |                         |
| akColorN700A                       | string   | colors.N700A      | string   |                         |
| akColorN800A                       | string   | colors.N800A      | string   |                         |
| akFontFamily                       | string   | fontFamily        | function |                         |
| akFontSizeDefault                  | string   | fontSize          | function | Old '14px' New () => 14 |
| akCodeFontFamily                   | string   | codeFontFamily    | function |                         |
| akGridSizeUnitless                 | number   | gridSize          | function |                         |
| akGridSize                         | string   | ?                 | ?        | Old '8px', new: ?       |
| akZIndexCard                       | number   | layers.card       | function |                         |
| akZIndexDialog                     | number   | layers.dialog     | function |                         |
| akZIndexNavigation                 | number   | layers.navigation | function |                         |
| akZIndexLayer                      | number   | layers.layer      | function |                         |
| akZIndexBlanket                    | number   | layers.blanket    | function |                         |
| akZIndexModal                      | number   | layers.modal      | function |                         |
| akZIndexFlag                       | number   | layers.flag       | function |                         |
| akAnimationMixins.createBold       | function | ?                 | ?        | No replacement?         |
| akAnimationMixins.createCombined   | function | ?                 | ?        | No replacement?         |
| akAnimationMixins.createOptimistic | function | ?                 | ?        | No replacement?         |
| akAnimationMixins.interpolate      | function | ?                 | ?        | No replacement?         |
| akElevationMixins.e100             | string   | ?                 | ?        | No replacement?         |
| akElevationMixins.e200             | string   | ?                 | ?        | No replacement?         |
| akElevationMixins.e500             | string   | ?                 | ?        | No replacement?         |
| akElevationMixins.e600             | string   | ?                 | ?        | No replacement?         |
| akHelperMixins.focusRing.generate  | function | ?                 | ?        | No replacement?         |
| akHelperMixins.focusRing.none      | string   | ?                 | ?        | No replacement?         |
| akHelperMixins.text.truncate       | function | ?                 | ?        | No replacement?         |
| akHelperMixins.placeholder         | function | ?                 | ?        | No replacement?         |
| akTypographyMixins.h100            | string   | typography.h100   | function |                         |
| akTypographyMixins.h200            | string   | typography.h200   | function |                         |
| akTypographyMixins.h300            | string   | typography.h300   | function |                         |
| akTypographyMixins.h400            | string   | typography.h400   | function |                         |
| akTypographyMixins.h500            | string   | typography.h500   | function |                         |
| akTypographyMixins.h600            | string   | typography.h600   | function |                         |
| akTypographyMixins.h700            | string   | typography.h700   | function |                         |
| akTypographyMixins.h800            | string   | typography.h800   | function |                         |
| akTypographyMixins.h900            | string   | typography.h900   | function |                         |
