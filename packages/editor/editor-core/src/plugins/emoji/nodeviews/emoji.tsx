import * as React from 'react';
import styled from 'styled-components';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import Emoji from '../ui/Emoji';

const Wrapper = styled.span`
  user-select: all;
`;

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
  providerFactory: ProviderFactory;
}

export default class EmojiNode extends React.PureComponent<Props, {}> {
  render() {
    const { node, providerFactory } = this.props;
    const { shortName, id, text } = node.attrs;

    return (
      <Wrapper>
        <Emoji
          providers={providerFactory}
          id={id}
          shortName={shortName}
          fallback={text}
        />
      </Wrapper>
    );
  }
}
