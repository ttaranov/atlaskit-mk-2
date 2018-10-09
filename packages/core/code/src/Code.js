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
  codeStyle?: {},
  showLineNumbers?: boolean,
  lineNumberContainerStyle?: {},
  codeTagProps?: {},
};

type CodeState = {
  language: string,
};

export class Code extends PureComponent<CodeProps, CodeState> {
  static defaultProps = {
    language: '',
    theme: {},
    showLineNumbers: false,
    lineNumberContainerStyle: null,
    codeTagProps: {},
  };

  state = {
    language: normalizeLanguage(''),
  };

  async registerLanguage(language: string) {
    if (!SyntaxHighlighter.astGenerator) {
      await SyntaxHighlighter.astGeneratorPromise;
    }

    if (SyntaxHighlighter.astGenerator.registered(language)) {
      return this.setState({ language });
    }

    if (!languageLoaders[language]) {
      return undefined;
    }

    await languageLoaders[language]();

    // Once the language has been loaded we need to force a re-render
    // Because react-syntax-highlighter internals are not react
    return this.setState({ language });
  }

  componentDidMount() {
    const language = normalizeLanguage(this.props.language);
    this.registerLanguage(language);
  }

  componentDidUpdate({ language: prevLanguage }: CodeProps) {
    const language = normalizeLanguage(this.props.language);

    if (prevLanguage !== language) {
      this.registerLanguage(language);
    }
  }

  render() {
    const { inlineCodeStyle } = applyTheme(this.props.theme);

    const props = {
      language: this.state.language,
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
