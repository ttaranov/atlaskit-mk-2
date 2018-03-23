import * as React from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { createParagraphAtEnd } from '../../../commands';

const ClickWrapper = styled.div`
  flex-grow: 1;
  height: 100%;
`;
ClickWrapper.displayName = 'ClickWrapper';

export interface Props {
  editorView?: EditorView;
  children?: any;
}

export default class ClickAreaBlock extends React.Component<Props> {
  private handleClick = event => {
    const { editorView } = this.props;
    if (editorView) {
      if (createParagraphAtEnd()(editorView.state, editorView.dispatch)) {
        editorView.focus();
        event.stopPropagation();
      }
    }
  };

  render() {
    return (
      <ClickWrapper onClick={this.handleClick}>
        {this.props.children}
      </ClickWrapper>
    );
  }
}
