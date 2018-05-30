// @flow

import PropTypes from 'prop-types';
import React, { Children, Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { TransitionGroup } from 'react-transition-group';
import Blanket from '@atlaskit/blanket';

import { NavigationSubscriber } from '@atlaskit/navigation-next';
import DrawerPrimitive from './primitives';
import { Fade } from './transitions';
import type { DrawerProps } from './types';

// resolve lifecycle methods
const OnlyChild = ({ children }) => Children.toArray(children)[0] || null;
const DrawerSwitch = ({ icon, isOpen, ...props }, { defaultDrawerIcon }) => {
  if (!props.navigation.drawerGateway) return null;

  return createPortal(
    <TransitionGroup component={OnlyChild}>
      {isOpen ? <Drawer icon={icon || defaultDrawerIcon} {...props} /> : null}
    </TransitionGroup>,
    props.navigation.drawerGateway,
  );
};
DrawerSwitch.contextTypes = {
  defaultDrawerIcon: PropTypes.func,
};

class Drawer extends Component<DrawerProps> {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }
  handleClose = event => {
    const { onClose, navigation } = this.props;
    const closeFn = onClose || navigation.closeActiveDrawer;

    closeFn(event);
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
    return (
      <Fragment>
        {/* $FlowFixMe the `in` prop is internal */}
        <Fade in={this.props.in}>
          <Blanket isTinted onBlanketClicked={this.handleClose} />
        </Fade>
        <DrawerPrimitive {...this.props} />
      </Fragment>
    );
  }
}

export default (props: *) => (
  <NavigationSubscriber>
    {navigation => <DrawerSwitch navigation={navigation} {...props} />}
  </NavigationSubscriber>
);
