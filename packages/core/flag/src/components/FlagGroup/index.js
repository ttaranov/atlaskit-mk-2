// @flow
import React, { Children, cloneElement, Component } from 'react';
import { Transition } from 'react-transition-group';
import { withRenderTarget } from '@atlaskit/layer-manager';

import Wrapper from '../../styled/Wrapper';
import Group, { SROnly, Inner } from './styledFlagGroup';
import type { ChildrenType, FunctionType } from '../../types';

type Props = {
  /** Flag elements to be displayed. */
  children?: ChildrenType,
  /** Handler which will be called when a Flag's dismiss button is clicked.
   * Receives the id of the dismissed Flag as a parameter.
   */
  onDismissed?: FunctionType,
};

class FlagGroup extends Component<Props, {}> {
  props: Props; // eslint-disable-line react/sort-comp

  renderChildren = () => {
    const { children, onDismissed } = this.props;

    return Children.map(children, (flag, idx) => {
      const isDismissAllowed = idx === 0;
      const { id } = flag.props;

      return (
        <Transition
          key={id}
          addEndListener={(node, done) => {
            node.addEventListener('animationend', done);
          }}
        >
          {transitionState => (
            <Wrapper transitionState={transitionState}>
              {cloneElement(flag, { onDismissed, isDismissAllowed })}
            </Wrapper>
          )}
        </Transition>
      );
    });
  };

  render() {
    return (
      <Group>
        <SROnly>Flag notifications</SROnly>
        <Inner component="div">{this.renderChildren()}</Inner>
      </Group>
    );
  }
}

export default withRenderTarget(
  {
    target: 'flag',
    withTransitionGroup: false,
  },
  // $FlowFixMe TEMPORARY
  FlagGroup,
);
