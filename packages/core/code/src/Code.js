// @flow
import React, { PureComponent } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/light';
import { normalizeLanguage } from './supportedLanguages';
import { type Theme, applyTheme } from './themes/themeBuilder';
import { withTheme } from 'styled-components';

type CodeProps = {
  /** The code to be formatted */
  text: string,
  /** The language in which the code is written */
  language?: string,
  /** A custom theme to be applied, implements the Theme interface */
  theme?: Theme | any,
};

class Code extends PureComponent<CodeProps, {}> {
  static defaultProps = {
    language: '',
    theme: {},
  };

  render() {
    const { language } = this.props;
    const { inlineCodeStyle } = applyTheme(this.props.theme);
    const props = {
      language: normalizeLanguage(language),
      PreTag: 'span',
      style: inlineCodeStyle,
      showLineNumbers: false,
    };
    return <SyntaxHighlighter {...props}>{this.props.text}</SyntaxHighlighter>;
  }
}

export default withTheme(Code);
