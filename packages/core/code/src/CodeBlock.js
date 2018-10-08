// @flow
import React, { PureComponent } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/prism-async';
import { withTheme, ThemeProvider } from 'styled-components';
import {
  normalizeLanguage,
  type ADFSupportedLanguages,
} from './supportedLanguages';
import { type Theme, type ThemeProps, applyTheme } from './themes/themeBuilder';

type CodeBlockProps = {
  /** The code to be formatted */
  text: string,
  /** The language in which the code is written */
  language?: ADFSupportedLanguages | string,
  /** Indicates whether or not to show line numbers */
  showLineNumbers?: boolean,
  /** A custom theme to be applied, implements the Theme interface */
  theme?: Theme | ThemeProps,
};

const LANGUAGE_FALLBACK = 'clike';

export class CodeBlock extends PureComponent<CodeBlockProps, {}> {
  static displayName = 'CodeBlock';

  static defaultProps = {
    showLineNumbers: true,
    language: LANGUAGE_FALLBACK,
    theme: {},
  };

  handleCopy = (event: any) => {
    /**
     * We don't want to copy the markup after highlighting, but rather the preformatted text in the selection
     */
    const data = event.nativeEvent.clipboardData;
    if (data) {
      event.preventDefault();
      const selectedText = window.getSelection().toString();
      const document = `<!doctype html><html><head></head><body><pre>${selectedText}</pre></body></html>`;
      data.clearData();
      data.setData('text/html', document);
      data.setData('text/plain', selectedText);
    }
  };

  render() {
    const {
      lineNumberContainerStyle,
      codeBlockStyle,
      codeContainerStyle,
    } = applyTheme(this.props.theme);
    const props = {
      language: normalizeLanguage(this.props.language || LANGUAGE_FALLBACK),
      style: codeBlockStyle,
      showLineNumbers: this.props.showLineNumbers,
      PreTag: 'span',
      codeTagProps: { style: codeContainerStyle },
      lineNumberContainerStyle,
    };
    const codeText = this.props.text.toString();

    return (
      <SyntaxHighlighter {...props} onCopy={this.handleCopy}>
        {codeText}
      </SyntaxHighlighter>
    );
  }
}

const CodeBlockWithTheme = withTheme(CodeBlock);
const emptyTheme = {};
export default function(props: {}) {
  return (
    <ThemeProvider theme={emptyTheme}>
      <CodeBlockWithTheme {...props} />
    </ThemeProvider>
  );
}
