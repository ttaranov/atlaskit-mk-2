// @flow

import React from 'react';
import { colors } from '@atlaskit/theme';
import { AkCodeBlock } from '../src';

const exampleCodeBlock = `
  class HelloMessage extends React.Component {
    render() {
      return (
        <div>
          Hello {this.props.name}
        </div>
      );
    }
  }

  ReactDOM.render(
    <HelloMessage name="Taylor" />,
    mountNode
  );
`;

const theme = {
  lineNumberColor: colors.N90,
  lineNumberBgColor: colors.N600,
  backgroundColor: colors.N400,
  textColor: colors.N50,
  substringColor: colors.N400,
  keywordColor: colors.P75,
  attributeColor: colors.T500,
  selectorTagColor: colors.P75,
  nameColor: colors.P75,
  builtInColor: colors.P75,
  literalColor: colors.P75,
  bulletColor: colors.P75,
  codeColor: colors.P75,
  additionColor: colors.P75,
  regexpColor: colors.T300,
  symbolColor: colors.T300,
  variableColor: colors.T300,
  templateVariableColor: colors.T300,
  linkColor: colors.B100,
  selectorAttributeColor: colors.T300,
  selectorPseudoColor: colors.T300,
  typeColor: colors.T500,
  stringColor: colors.G200,
  selectorIdColor: colors.T500,
  selectorClassColor: colors.T500,
  quoteColor: colors.T500,
  templateTagColor: colors.T500,
  deletionColor: colors.T500,
  titleColor: colors.R100,
  sectionColor: colors.R100,
  commentColor: colors.N90,
  metaKeywordColor: colors.G200,
  metaColor: colors.N400,
  functionColor: colors.G200,
  numberColor: colors.B100,
};

export default function Component() {
  return <AkCodeBlock language="java" text={exampleCodeBlock} theme={theme} />;
}
