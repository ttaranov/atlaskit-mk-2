// @flow
import React, { Component } from 'react';
import Spinner from '@atlaskit/spinner';

import { Cell, TreeRowContainer, LoaderItemContainer } from '../styled';

type Props = {
  isCompleting: boolean,
  onComplete: Function,
  depth?: number,
};

type State = {
  phase: 'loading' | 'complete',
};

export default class LoaderItem extends Component<Props, State> {
  static defaultProps = {
    depth: 1,
  };

  state: State = {
    phase: 'loading',
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.isCompleting && prevState.phase === 'loading') {
      return {
        phase: 'complete',
      };
    }
    return null;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.phase === 'loading' && this.state.phase === 'complete') {
      if (this.props.onComplete) {
        this.props.onComplete();
      }
    }
  }

  render() {
    const { isCompleting, depth } = this.props;
    const { phase } = this.state;
    return phase === 'loading' ? (
      <TreeRowContainer>
        <Cell indentLevel={depth} width={'100%'}>
          <LoaderItemContainer isRoot={depth === 1}>
            <Spinner
              isCompleting={isCompleting}
              size="small"
              invertColor={false}
            />
          </LoaderItemContainer>
        </Cell>
      </TreeRowContainer>
    ) : null;
  }
}
