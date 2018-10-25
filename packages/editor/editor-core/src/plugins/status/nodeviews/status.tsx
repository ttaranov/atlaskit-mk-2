import * as React from 'react';
import styled from 'styled-components';
import { Node as PMNode } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Status } from '@atlaskit/status';
import { pluginKey, StatusState } from '../plugin';
import { setStatusPickerAt } from '../actions';
import { colors } from '@atlaskit/theme';

const { B100 } = colors;

interface StatusContainerProps {
  selected: boolean;
}

const StatusContainer = styled.span`
  cursor: pointer;

  * ::selection {
    background-color: transparent;
  }

  > * {
    border: 1px solid;
    border-color: ${(props: StatusContainerProps) =>
      props.selected ? B100 : 'transparent'};
  }
`;

export interface Props {
  node: PMNode;
  view: EditorView;
  getPos: () => number;
}

export interface State {
  selected: boolean;
}

export default class StatusNodeView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selected: false,
    };
  }

  componentDidMount() {
    const { view } = this.props;
    const pluginState: StatusState = pluginKey.getState(view.state);
    pluginState.selectionChanges.subscribe(this.handleSelectionChange);
  }

  componentWillUnmount() {
    const { view } = this.props;
    const pluginState: StatusState = pluginKey.getState(view.state);
    pluginState.selectionChanges.unsubscribe(this.handleSelectionChange);
  }

  private handleSelectionChange = (
    newSelection: Selection,
    prevSelection: Selection,
  ) => {
    const { getPos } = this.props;
    const { from, to } = newSelection;
    const statusPos = getPos();
    const selected = from <= statusPos && to > statusPos;

    if (this.state.selected !== selected) {
      this.setState({
        selected,
      });
    }
  };

  render() {
    const {
      attrs: { text, color, localId },
    } = this.props.node;
    const { selected } = this.state;

    return (
      <StatusContainer onClick={this.handleClick} selected={selected}>
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
