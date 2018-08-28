import { fontSize } from '@atlaskit/theme';
import {
  akCodeFontFamily,
  akColorB100,
  akColorB400,
  akColorB50,
  akColorN0,
  akColorN20,
  akColorN30,
  akColorN40,
  akColorN100,
  akColorN500,
  akColorN700,
  akColorN900,
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
export const akEditorMentionSelected = akColorN100;
export const akEditorRuleBackground = akColorN30;
export const akEditorRuleBorderRadius = '1px';
export const defaultEditorFontStyles = `
  font-size: ${fontSize()}px;
  font-weight: normal;
`;
export const akEditorToolbarKeylineHeight = 2;
