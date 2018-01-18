// @flow
import React, { PureComponent } from 'react';
import Spinner from '@atlaskit/spinner';

import { Cell, TreeRowContainer, LoaderItemContainer } from '../styled';

type Props = {
  isCompleting: boolean,
  onComplete: Function,
  depth?: number,
  delay?: number,
};

type State = {
  phase: 'delaying' | 'loading' | 'complete',
};

export default class LoaderItem extends PureComponent<Props, State> {
  static defaultProps = {
    depth: 1,
    delay: 100,
  };

  delayTimeoutId = null;

  state: State = {
    phase: 'delaying',
  };

  componentDidMount() {
    this.delayTimeoutId = setTimeout(() => {
      if (this.state.phase === 'delaying') {
        this.setState({
          phase: 'loading',
        });
      }
      this.delayTimeoutId = null;
    }, this.props.delay);
  }

  componentWillUnmount() {
    if (this.delayTimeoutId !== null) {
      clearTimeout(this.delayTimeoutId);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.state.phase === 'delaying' && nextProps.isCompleting) {
      this.setComplete();
    }
  }

  setComplete = () => {
    this.setState({ phase: 'complete' });
    if (this.props.onComplete) {
      this.props.onComplete();
    }
  };

  render() {
    const { isCompleting, depth } = this.props;
    const { phase } = this.state;
    return (
      phase === 'loading' && (
        <TreeRowContainer>
          <Cell indentLevel={depth} width={'100%'}>
            <LoaderItemContainer isRoot={depth === 1}>
              <Spinner
                isCompleting={isCompleting}
                onComplete={this.setComplete}
                size="small"
                invertColor={false}
              />
            </LoaderItemContainer>
          </Cell>
        </TreeRowContainer>
      )
    );
  }
}
