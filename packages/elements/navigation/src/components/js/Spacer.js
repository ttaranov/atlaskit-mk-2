import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import SpacerInner from '../styled/SpacerInner';

export default class Spacer extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    innerRef: PropTypes.func,
    onTransitionEnd: PropTypes.func,
    shouldAnimate: PropTypes.bool,
    width: PropTypes.number,
  }
  static defaultProps = {
    width: 0,
    shouldAnimate: false,
  }
  render() {
    const {
      children, innerRef, onTransitionEnd, shouldAnimate, width,
    } = this.props;

    return (
      <SpacerInner
        innerRef={innerRef}
        onTransitionEnd={onTransitionEnd}
        shouldAnimate={shouldAnimate}
        style={{ width }}
      >
        {children}
      </SpacerInner>
    );
  }
}
