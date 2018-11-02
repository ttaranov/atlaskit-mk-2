import {
  codeFontFamily,
  layers,
  colors,
  fontSize as defaultFontSize,
} from '@atlaskit/theme';

const {
  B100,
  B300,
  B400,
  B50,
  B75,
  N0,
  N20,
  N40,
  N50,
  N100,
  N500,
  N700,
  N900,
  R300,
  R50,
  R75,
} = colors;

export const akEditorCodeFontFamily = codeFontFamily();
export const akEditorInactiveForeground = N500;
export const akEditorFocus = B100;
export const akEditorSubtleAccent = N40;
export const akEditorActiveBackground = N500;
export const akEditorActiveForeground = N0;
export const akEditorBlockquoteBorderColor = N40;
export const akEditorDropdownActiveBackground = N900;
export const akEditorPopupBackground = N700;
export const akEditorPopupText = B50;
export const akEditorPrimaryButton = B400;
export const akEditorCodeBackground = N20;
export const akEditorCodeBlockPadding = '12px';
export const akEditorCodeInlinePadding = '2px 4px';
export const akEditorUnitZIndex = 1;
export const akEditorSmallZIndex = 2;
// z-index for main menu bar -
// this is highest as it should be above anything else in editor below.
export const akEditorMenuZIndex = layers.blanket();
// z-index used for floating toolbars like code block, table etc
export const akEditorFloatingPanelZIndex = layers.layer();
// z-index used for pickers (date, emoji, mentions) and type-aheads, hyperlinks
export const akEditorFloatingDialogZIndex = akEditorFloatingPanelZIndex + 10;
// z-index used for floating toolbars table cell menu which are above block toolbars
export const akEditorFloatingOverlapPanelZIndex =
  akEditorFloatingPanelZIndex + 5;
export const akEditorMentionSelected = N100;
export const akEditorTableToolbarSize = 11;
export const akEditorTableBorder = N50;
export const akEditorTableToolbar = N20;
export const akEditorTableFloatingControls = N20;
export const akEditorTableCellSelected = B75;
export const akEditorTableToolbarSelected = B100;
export const akEditorTableBorderSelected = B300;
export const akEditorTableCellDelete = R50;
export const akEditorTableBorderDelete = R300;
export const akEditorTableToolbarDelete = R75;
export const akEditorTableBorderRadius = '3px';
export const akEditorTableCellBackgroundOpacity = 0.5;
export const akEditorFullPageMaxWidth = 680;
export const akEditorDefaultLayoutWidth = 680;
export const akEditorWideLayoutWidth = 960;
export const akEditorTableNumberColumnWidth = 42;
export const akEditorBreakoutPadding = 96;
export const akEditorElementMinWidth = 150;
export const akEditorMobileBreakoutPoint = 720;

export const editorFontSize = ({ theme }) =>
  theme && theme.baseFontSize ? theme.baseFontSize : defaultFontSize();

export const relativeSize = (multiplier: number) => ({ theme }) =>
  editorFontSize({ theme }) * multiplier;

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
export const blockNodesVerticalMargin = '1.142em';
