// @flow

import PropTypes from 'prop-types';
import React, { Children, Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { TransitionGroup } from 'react-transition-group';
import Blanket from '@atlaskit/blanket';

import DrawerPrimitive from './primitives';
import { Fade } from './transitions';
import type { DrawerProps } from './types';

// resolve lifecycle methods
class Drawer extends Component<DrawerProps> {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }
  handleClose = event => {
    const { onClose } = this.props;

    if (onClose) {
      onClose(event);
    }
  };
  handleKeyDown = (event: SyntheticKeyboardEvent<*>) => {
    const { onKeyDown } = this.props;

    if (event.key === 'Escape') {
      this.handleClose(event);
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
  };
  render() {
    console.log(this.props.in);
    return (
      <Fragment>
        {/* $FlowFixMe the `in` prop is internal */}
        <Fade in={this.props.isOpen}>
          <Blanket isTinted onBlanketClicked={this.handleClose} />
        </Fade>
        <DrawerPrimitive {...this.props} isOpen={this.props.isOpen} />
      </Fragment>
    );
  }
}

const OnlyChild = ({ children }) => Children.toArray(children)[0] || null;
const DrawerSwitch = ({ icon, isOpen, ...props }, { defaultDrawerIcon }) => {
  console.log(isOpen);
  const div = document.createElement('div');
  const body = document.querySelector('body');
  if (!body) {
    return;
  }
  body.appendChild(div);
  return createPortal(
    <TransitionGroup component={OnlyChild}>
      <Drawer icon={icon || defaultDrawerIcon} isOpen={isOpen} {...props} />
    </TransitionGroup>,
    div,
  );
};
DrawerSwitch.contextTypes = {
  defaultDrawerIcon: PropTypes.func,
};

export default (props: *) => <DrawerSwitch {...props} />;
