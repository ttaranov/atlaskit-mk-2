// @flow
import React, { PureComponent } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/prism-async-light';
import { withTheme, ThemeProvider } from 'styled-components';
import {
  normalizeLanguage,
  type ADFSupportedLanguages,
  languageLoaders,
} from './supportedLanguages';
import { type Theme, type ThemeProps, applyTheme } from './themes/themeBuilder';

type CodeProps = {
  /** The code to be formatted */
  text: string,
  /** The language in which the code is written */
  language?: ADFSupportedLanguages | string,
  /** A custom theme to be applied, implements the Theme interface */
  theme?: Theme | ThemeProps,
};

export class Code extends PureComponent<CodeProps, {}> {
  static defaultProps = {
    language: '',
    theme: {},
  };

  componentDidMount() {
    const language = normalizeLanguage(this.props.language);

    if (SyntaxHighlighter.isRegistered(language) && languageLoaders[language]) {
      languageLoaders[language]().then(() => {
        // Once the language has been loaded we need to force a re-render
        // Because react-syntax-highlighter internals are not react
        this.forceUpdate();
      });
    }
  }

  render() {
    const { inlineCodeStyle } = applyTheme(this.props.theme);
    const props = {
      language: normalizeLanguage(this.props.language),
      PreTag: 'span',
      style: inlineCodeStyle,
      showLineNumbers: false,
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
