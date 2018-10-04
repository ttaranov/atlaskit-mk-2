import * as React from 'react';
import { PureComponent } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import styled from 'styled-components';
import {
  ProsemirrorGetPosHandler,
  ReactComponentConstructor,
} from '../../../nodeviews';

interface Props {
  getPos: ProsemirrorGetPosHandler;
  node: PMNode;
  selectedNode: number;
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

    constructor(props) {
      super(props);
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
