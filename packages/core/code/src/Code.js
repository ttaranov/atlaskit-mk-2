// @flow
import React, { PureComponent } from 'react';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';

import { withTheme, ThemeProvider } from 'styled-components';
import {
  normalizeLanguage,
  type ADFSupportedLanguages,
} from './supportedLanguages';
import { type Theme, type ThemeProps, applyTheme } from './themes/themeBuilder';

type CodeProps = {
  /** The code to be formatted */
  text: string,
  /** The language in which the code is written */
  language?: ADFSupportedLanguages | string,
  /** A custom theme to be applied, implements the Theme interface */
  theme?: Theme | ThemeProps,
  codeStyle?: {},
  showLineNumbers?: boolean,
  lineNumberContainerStyle?: {},
  codeTagProps?: {},
};

export class Code extends PureComponent<CodeProps, {}> {
  static defaultProps = {
    language: '',
    theme: {},
    showLineNumbers: false,
    lineNumberContainerStyle: null,
    codeTagProps: {},
  };

  render() {
    const { inlineCodeStyle } = applyTheme(this.props.theme);
    const language = normalizeLanguage(this.props.language);

    const props = {
      language,
      PreTag: 'span',
      style: this.props.codeStyle || inlineCodeStyle,
      showLineNumbers: this.props.showLineNumbers,
      lineNumberContainerStyle: this.props.lineNumberContainerStyle,
      codeTagProps: this.props.codeTagProps,
    };

    return <SyntaxHighlighter {...props}>{this.props.text}</SyntaxHighlighter>;
  }
}

const CodeWithTheme = withTheme(Code);
const emptyTheme = {};
export default function(props: {}) {
  return (
    <ThemeProvider theme={emptyTheme}>
      <CodeWithTheme {...props} />
    </ThemeProvider>
  );
}
