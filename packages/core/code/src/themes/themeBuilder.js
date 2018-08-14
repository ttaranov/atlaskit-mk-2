// @flow
import {
  codeFontFamily,
  borderRadius,
  gridSize,
  fontSize,
} from '@atlaskit/theme';

import { defaultColors } from './defaultTheme';

export type ThemeModes = 'light' | 'dark';
export type ThemeProps = {
  __ATLASKIT_THEME__: { mode: ThemeModes },
};

export type Theme = {
  lineNumberColor?: string | number,
  lineNumberBgColor?: string | number,
  backgroundColor?: string | number,
  textColor?: string | number,
  substringColor?: string | number,
  keywordColor?: string | number,
  attributeColor?: string | number,
  selectorTagColor?: string | number,
  docTagColor?: string | number,
  nameColor?: string | number,
  builtInColor?: string | number,
  literalColor?: string | number,
  bulletColor?: string | number,
  codeColor?: string | number,
  additionColor?: string | number,
  regexpColor?: string | number,
  symbolColor?: string | number,
  variableColor?: string | number,
  templateVariableColor?: string | number,
  linkColor?: string | number,
  selectorAttributeColor?: string | number,
  selectorPseudoColor?: string | number,
  typeColor?: string | number,
  stringColor?: string | number,
  selectorIdColor?: string | number,
  selectorClassColor?: string | number,
  quoteColor?: string | number,
  templateTagColor?: string | number,
  deletionColor?: string | number,
  titleColor?: string | number,
  sectionColor?: string | number,
  commentColor?: string | number,
  metaKeywordColor?: string | number,
  metaColor?: string | number,
  functionColor?: string | number,
  numberColor?: string | number,
};

const codeContainerStyle = {
  fontFamily: codeFontFamily,
  fontSize: '12px',
  top: gridSize(),
  left: '16px', // 2x akGridSize
  position: 'relative',
  paddingRight: '16px', // 2x akGridSize
};

const lineNumberContainerStyle = (theme: Theme) => ({
  fontSize: `${fontSize()}px`,
  lineHeight: '20px',
  color: theme.lineNumberColor,
  backgroundColor: theme.lineNumberBgColor,
  padding: gridSize(),
  float: 'left',
  top: '0',
  left: '0',
  textAlign: 'right',
  userSelect: 'none',
});

const sharedCodeStyle = (theme: Theme) => ({
  keyword: {
    color: theme.keywordColor,
    fontWeight: 'bolder',
  },
  'attr-name': {
    color: theme.attributeColor,
  },
  selector: {
    color: theme.selectorTagColor,
  },
  comment: {
    color: theme.commentColor,
    fontFamily: `SFMono-MediumItalic, ${codeFontFamily()}`,
    fontStyle: 'italic',
  },
  'block-comment': {
    color: theme.commentColor,
    fontFamily: `SFMono-MediumItalic, ${codeFontFamily()}`,
    fontStyle: 'italic',
  },
  'function-name': {
    color: theme.sectionColor,
  },
  'class-name': {
    color: theme.sectionColor,
  },
  doctype: {
    color: theme.docTagColor,
  },
  substr: {
    color: theme.substringColor,
  },
  namespace: {
    color: theme.nameColor,
  },
  builtin: {
    color: theme.builtInColor,
  },
  entity: {
    color: theme.literalColor,
  },
  bullet: {
    color: theme.bulletColor,
  },
  code: {
    color: theme.codeColor,
  },
  addition: {
    color: theme.additionColor,
  },
  regex: {
    color: theme.regexpColor,
  },
  symbol: {
    color: theme.symbolColor,
  },
  variable: {
    color: theme.variableColor,
  },
  url: {
    color: theme.linkColor,
  },
  'selector-attr': {
    color: theme.selectorAttributeColor,
  },
  'selector-pseudo': {
    color: theme.selectorPseudoColor,
  },
  type: {
    color: theme.typeColor,
  },
  string: {
    color: theme.stringColor,
  },
  quote: {
    color: theme.quoteColor,
  },
  tag: {
    color: theme.templateTagColor,
  },
  deletion: {
    color: theme.deletionColor,
  },
  title: {
    color: theme.titleColor,
  },
  section: {
    color: theme.sectionColor,
  },
  'meta-keyword': {
    color: theme.metaKeywordColor,
  },
  meta: {
    color: theme.metaColor,
  },
  italic: {
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: 'bolder',
  },
  function: {
    color: theme.functionColor,
  },
  number: {
    color: theme.numberColor,
  },
});

const codeStyle = theme => ({
  fontFamily: codeFontFamily,
  fontSize: '12px',
  background: theme.backgroundColor,
  color: theme.textColor,
  borderRadius: borderRadius(),
  display: 'block',
  lineHeight: 1.6,
  overflowX: 'auto',
  transform: 'translate3d(0,0,0)',
  whiteSpace: 'pre',
});

const codeBlockStyle = (theme: Theme) => ({
  'pre[class*="language-"]': codeStyle(theme),
  ...sharedCodeStyle(theme),
});

const inlineCodeStyle = (theme: Theme) => ({
  'pre[class*="language-"]': {
    ...codeStyle(theme),
    padding: '2px 4px',
    display: 'inline',
  },
  ...sharedCodeStyle(theme),
});

export function applyTheme(theme: ThemeProps | Theme = {}) {
  const newTheme = { ...defaultColors(theme), ...theme };
  return {
    lineNumberContainerStyle: lineNumberContainerStyle(newTheme),
    codeBlockStyle: codeBlockStyle(newTheme),
    inlineCodeStyle: inlineCodeStyle(newTheme),
    codeContainerStyle,
  };
}
