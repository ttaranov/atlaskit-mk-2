import {
  akCodeFontFamily,
  akColorB100,
  akColorB300,
  akColorB400,
  akColorB50,
  akColorB75,
  akColorN0,
  akColorN20,
  akColorN40,
  akColorN50,
  akColorN100,
  akColorN500,
  akColorN700,
  akColorN900,
  akZIndexLayer,
  akZIndexBlanket,
  akColorR300,
  akColorR50,
  akColorR75,
} from '@atlaskit/util-shared-styles';

export const akEditorCodeFontFamily = akCodeFontFamily;
export const akEditorInactiveForeground = akColorN500;
export const akEditorFocus = akColorB100;
export const akEditorSubtleAccent = akColorN40;
export const akEditorActiveBackground = akColorN500;
export const akEditorActiveForeground = akColorN0;
export const akEditorBlockquoteBorderColor = akColorN40;
export const akEditorDropdownActiveBackground = akColorN900;
export const akEditorPopupBackground = akColorN700;
export const akEditorPopupText = akColorB50;
export const akEditorPrimaryButton = akColorB400;
export const akEditorCodeBackground = akColorN20;
export const akEditorCodeBlockPadding = '12px';
export const akEditorCodeInlinePadding = '2px 4px';
export const akEditorUnitZIndex = 1;
export const akEditorSmallZIndex = 2;
// z-index for main menu bar -
// this is highest as it should be above anything else in editor below.
export const akEditorMenuZIndex = akZIndexBlanket;
// z-index used for pickers (date, emoji, mentions) and type-aheads, hyperlinks
export const akEditorFloatingDialogZIndex = akZIndexLayer + 10;
// z-index used for floating toolbars table cell menu which are above block toolbars
export const akEditorFloatingOverlapPanelZIndex = akZIndexLayer + 5;
// z-index used for floating toolbars like code block, table etc
export const akEditorFloatingPanelZIndex = akZIndexLayer;
export const akEditorMentionSelected = akColorN100;
export const akEditorTableToolbarSize = 11;
export const akEditorTableBorder = akColorN50;
export const akEditorTableToolbar = akColorN20;
export const akEditorTableFloatingControls = akColorN20;
export const akEditorTableCellSelected = akColorB75;
export const akEditorTableToolbarSelected = akColorB100;
export const akEditorTableBorderSelected = akColorB300;
export const akEditorTableCellDelete = akColorR50;
export const akEditorTableBorderDelete = akColorR300;
export const akEditorTableToolbarDelete = akColorR75;
export const akEditorTableBorderRadius = '3px';
export const akEditorTableCellBackgroundOpacity = 0.5;
export const akEditorFullPageMaxWidth = 680;
export const akEditorWideLayoutWidth = 960;
export const akEditorTableNumberColumnWidth = 40;
export const akEditorBreakoutPadding = 96;
