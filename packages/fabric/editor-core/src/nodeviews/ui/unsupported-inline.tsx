import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import {
  akBorderRadius,
  akColorN30,
  akColorN50,
} from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
const InlineNode = styled.span`
  align-items: center;
  background: ${akColorN30};
  border: 1px dashed ${akColorN50};
  border-radius: ${akBorderRadius};
  box-sizing: border-box;
  cursor: default;
  display: inline-flex;
  font-size: 13px;
  margin: 0 2px;
  min-height: 24px;
  padding: 0 10px;
  user-select: all;
  vertical-align: middle;
  white-space: nowrap;

  '&.ProseMirror-selectednode' {
    background: ${akColorN50};
    outline: none;
  }
`;

export default class UnsupportedInlineNode extends Component<{}, {}> {
  render() {
    return (
      <InlineNode>Unsupported content</InlineNode>
    );
  }
}
