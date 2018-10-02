import * as React from 'react';
import styled from 'styled-components';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { Status } from '@atlaskit/status';
import { setStatusPickerAt } from '../actions';

const StatusContainer = styled.span`
  cursor: pointer;
`;

export interface Props {
  node: PMNode;
  view: EditorView;
}

export default class StatusNodeView extends React.Component<Props> {
  render() {
    const {
      attrs: { text, color, localId },
    } = this.props.node;

    return (
      <StatusContainer onClick={this.handleClick}>
        <Status text={text} color={color} localId={localId} />
      </StatusContainer>
    );
  }

  private handleClick = (event: React.SyntheticEvent<any>) => {
    if (event.nativeEvent.stopImmediatePropagation) {
      event.nativeEvent.stopImmediatePropagation();
    }
    const { state, dispatch } = this.props.view;
    setStatusPickerAt(state.selection.from)(state, dispatch);
  };
}
