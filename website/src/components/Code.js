// @flow
import React, { PureComponent, type Node } from 'react';
import styled from 'styled-components';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import ToggleIcon from '@atlaskit/icon/glyph/code';
import 'prismjs/themes/prism-tomorrow.css';
import { colors, gridSize, themed } from '@atlaskit/theme';

const Code = styled.pre`
  border-radius: 5px;
  background-color: ${themed({ light: colors.N800, dark: colors.N800 })};
  color: ${themed({ light: colors.N60, dark: colors.N60 })};
  display: block;
  margin: 0 0 ${gridSize}px;
  overflow-x: auto;
  padding: ${gridSize}px;

  & code {
    font-family: Monaco, Menlo, monospace;
    font-size: 0.9em;
  }
`;

type Props = {
  content: string,
  grammar: 'jsx',
};

export default function CodeBlock(props: Props) {
  let syntax = Prism.languages[props.grammar];
  let highlighted = Prism.highlight(props.content, syntax);
  return (
    <Code>
      <code dangerouslySetInnerHTML={{ __html: highlighted }} />
    </Code>
  );
}
