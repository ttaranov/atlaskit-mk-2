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

    /* This basically reimplements the `delay` property of @atlaskit/spinner.
     * Unfortunately, spinner's implementation is currently broken / not useful:
     * it displays the 'completing' animation even if data is loaded
     * within the delay time. We want to completely hide the spinner for fast loads.
     */
    delay: 100,
  };

  delayTimeoutId = null;

  state: State = {
    phase: 'delaying',
  };

  componentDidMount() {
    this.checkIsCompleting(this.props.isCompleting);
    this.delayTimeoutId = setTimeout(() => {
      if (this.state.phase === 'delaying') {
        this.setState({
          phase: 'loading',
        });
      }
    }, this.props.delay);
  }

  componentWillUnmount() {
    clearTimeout(this.delayTimeoutId);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.checkIsCompleting(nextProps.isCompleting);
  }

  checkIsCompleting(isCompleting: boolean) {
    if (this.state.phase === 'delaying' && isCompleting) {
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
    return phase === 'loading' ? (
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
    ) : null;
  }
}
