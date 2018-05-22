// @flow
import { colors, themed } from '@atlaskit/theme';

import type { Theme } from './themeBuilder';

export function defaultColors(theme): Theme {
  return {
    lineNumberColor: themed({ light: colors.N90, dark: colors.DN90 })({
      theme,
    }),
    lineNumberBgColor: themed({ light: colors.N30, dark: colors.DN20 })({
      theme,
    }),
    backgroundColor: colors.codeBlock({ theme }),
    textColor: themed({ light: colors.N800, dark: colors.DN800 })({ theme }),
    substringColor: themed({ light: colors.N400, dark: colors.DN400 })({
      theme,
    }),
    keywordColor: colors.blue({ theme }),
    attributeColor: colors.teal({ theme }),
    selectorTagColor: colors.blue({ theme }),
    docTagColor: colors.yellow({ theme }),
    nameColor: colors.blue({ theme }),
    builtInColor: colors.blue({ theme }),
    literalColor: colors.blue({ theme }),
    bulletColor: colors.blue({ theme }),
    codeColor: colors.blue({ theme }),
    additionColor: colors.blue({ theme }),
    regexpColor: colors.teal({ theme }),
    symbolColor: colors.teal({ theme }),
    variableColor: colors.teal({ theme }),
    templateVariableColor: colors.teal({ theme }),
    linkColor: colors.purple({ theme }),
    selectorAttributeColor: colors.teal({ theme }),
    selectorPseudoColor: colors.teal({ theme }),
    typeColor: themed({ light: colors.T500, dark: colors.T300 })({ theme }),
    stringColor: colors.green({ theme }),
    selectorIdColor: themed({ light: colors.T500, dark: colors.T300 })({
      theme,
    }),
    selectorClassColor: themed({ light: colors.T500, dark: colors.T300 })({
      theme,
    }),
    quoteColor: themed({ light: colors.T500, dark: colors.T300 })({ theme }),
    templateTagColor: themed({ light: colors.T500, dark: colors.T300 })({
      theme,
    }),
    deletionColor: themed({ light: colors.T500, dark: colors.T300 })({ theme }),
    titleColor: colors.purple({ theme }),
    sectionColor: colors.purple({ theme }),
    commentColor: themed({ light: colors.N400, dark: colors.DN400 })({ theme }),
    metaKeywordColor: colors.green({ theme }),
    metaColor: themed({ light: colors.N400, dark: colors.DN400 })({ theme }),
    functionColor: themed({ light: colors.N800, dark: colors.DN800 })({
      theme,
    }),
    numberColor: colors.blue({ theme }),
  };
}
