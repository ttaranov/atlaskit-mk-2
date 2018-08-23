import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import styled from 'styled-components';
import { ReactNodeViewState } from '../../../plugins/base/pm-plugins/react-nodeview';
import { setNodeSelection } from '../../../utils';
import { getPosHandler } from '../../../nodeviews/ReactNodeView';

export interface ReactNodeViewComponents {
  [key: string]: React.ComponentClass<any> | React.StatelessComponent<any>;
}

export interface ReactNodeProps {
  selected: boolean;
}
export type ReactComponentConstructor = new (props: any) => React.Component<
  any,
  any
>;

interface Props {
  components: ReactNodeViewComponents;
  getPos: getPosHandler;
  pluginState: ReactNodeViewState;
  view: EditorView;
}

const Wrapper = styled.div`
  width: 100%;
`;
Wrapper.displayName = 'WrapperClickArea';

interface State {
  selected: boolean;
}

// tslint:disable-next-line:variable-name
export default function wrapComponentWithClickArea(
  ReactComponent: ReactComponentConstructor,
): ReactComponentConstructor {
  return class WrapperClickArea extends PureComponent<Props, State> {
    state: State = { selected: false };

    componentDidMount() {
      const { pluginState } = this.props;
      pluginState.subscribe(this.handleDocumentSelectionChange);
    }

    componentWillUnmount() {
      const { pluginState } = this.props;
      pluginState.unsubscribe(this.handleDocumentSelectionChange);
    }

    render() {
      return (
        <Wrapper onClick={this.onClick}>
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
      if (typeof nodePos === 'undefined') {
        return;
      }

      this.setState({
        selected: nodePos >= anchorPos && nodePos < headPos,
      });
    };

    private onClick = () => {
      const { getPos, view } = this.props;
      const pos = getPos();

      if (typeof pos === 'undefined') {
        return;
      }

      setNodeSelection(view, pos);
    };
  };
}
