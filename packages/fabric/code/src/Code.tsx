import * as React from 'react';
import { PureComponent } from 'react';
import * as PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { normalizeLanguage, languageList } from './supportedLanguages';
import { Theme, applyTheme } from './themes/themeBuilder';

export interface CodeProps {
  /** The code to be formatted */
  text: string;
  /** The language in which the code is written */
  language?: string;
  /** A custom theme to be applied, implements the Theme interface */
  theme?: Theme;
}

export default class Code extends PureComponent<CodeProps> {
  static propTypes = {
    text: PropTypes.string.isRequired,
    language: PropTypes.oneOf(languageList),
    theme: PropTypes.object
  };

  static defaultProps = {
    language: 'md',
    theme: {}
  };

  render() {
    const { language } = this.props;
    const { inlineCodeStyle } = applyTheme(this.props.theme);
    const props = {
      language: normalizeLanguage(language),
      PreTag: 'span',
      style: inlineCodeStyle,
      showLineNumbers: false
    };
    return (
      <SyntaxHighlighter {...props}>
        {this.props.text}
      </SyntaxHighlighter>
    );
  }
}
