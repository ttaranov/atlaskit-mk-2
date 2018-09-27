import * as React from 'react';
import { PureComponent } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import styled from 'styled-components';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  ReactNodeViewState,
  stateKey,
} from '../../../plugins/base/pm-plugins/react-nodeview';
import {
  ProsemirrorGetPosHandler,
  ReactComponentConstructor,
} from '../../types';
import { ReactNodeViewComponents } from '../';

interface Props {
  components: ReactNodeViewComponents;
  getPos: ProsemirrorGetPosHandler;
  node: PMNode;
  pluginState: ReactNodeViewState;
  providerFactory: ProviderFactory;
  view: EditorView;

  onSelection?: (selected: boolean) => void;
}

const Wrapper = styled.div`
  width: 100%;
`;
Wrapper.displayName = 'WrapperClickArea';

interface State {
  selected: number | null;
}

// tslint:disable-next-line:variable-name
export default function wrapComponentWithClickArea(
  ReactComponent: ReactComponentConstructor,
): ReactComponentConstructor {
  return class WrapperClickArea extends PureComponent<Props, State> {
    state: State = { selected: null };
    private pluginState: ReactNodeViewState;

    constructor(props) {
      super(props);
      this.pluginState = stateKey.getState(this.props.view.state);
    }

    componentDidMount() {
      const { pluginState } = this;
      pluginState.subscribe(this.handleDocumentSelectionChange);
    }

    componentWillUnmount() {
      const { pluginState } = this;
      pluginState.unsubscribe(this.handleDocumentSelectionChange);
    }

    render() {
      return (
        <Wrapper>
          <ReactComponent {...this.props} selected={this.state.selected} />
        </Wrapper>
      );
    }

    private handleDocumentSelectionChange = (
      anchorPos: number,
      headPos: number,
    ) => {
      const { getPos } = this.props;
      const nodePos = getPos();
      const isSelected =
        nodePos < anchorPos && headPos < nodePos + this.props.node.nodeSize;

      this.setState({
        selected: isSelected ? anchorPos : null,
      });
    };
  };
}
