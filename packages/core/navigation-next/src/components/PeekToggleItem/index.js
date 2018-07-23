// @flow

import React, { Component } from 'react';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';

import { GlobalItemPrimitive } from '../../';
import InteractionStateManager from '../InteractionStateManager';
import { UIState, UIStateSubscriber } from '../../ui-state';
import {
  ViewController,
  withNavigationViewController,
} from '../../view-controller';

type PeekToggleProps = {
  label: string,
  tooltip: string,
  isPeeking: boolean,
  navigationUI: UIState,
  navigationViewController: ViewController,
};

class PeekToggle extends Component<PeekToggleProps> {
  static defaultProps = {
    label: 'Main menu',
    tooltip: 'Main menu',
  };

  getIsHomeViewActive() {
    const {
      activeView,
      activePeekView,
    } = this.props.navigationViewController.state;
    if (!activeView || !activePeekView) {
      return false;
    }
    return activeView.id === activePeekView.id;
  }

  handleClick = () => {
    const { isPeeking, navigationUI, navigationViewController } = this.props;
    if (!isPeeking && navigationViewController.initialPeekViewId) {
      navigationViewController.setPeekView(
        navigationViewController.initialPeekViewId,
      );
    }
    navigationUI.togglePeek();
  };

  renderIcon = () => (this.props.isPeeking ? ArrowLeftIcon : MenuIcon);

  renderComponent = ({ className, children }) => {
    const isHomeViewActive = this.getIsHomeViewActive();
    const { isPeeking, navigationUI } = this.props;

    return (
      <button
        className={className}
        onClick={isHomeViewActive && !isPeeking ? null : this.handleClick}
        onMouseEnter={navigationUI.peekHint}
        onMouseLeave={navigationUI.unPeekHint}
      >
        {children}
      </button>
    );
  };

  render() {
    const { label, tooltip } = this.props;
    const { isPeeking } = this.props;
    const isHomeViewActive = this.getIsHomeViewActive();

    return (
      <InteractionStateManager>
        {({ isActive, isHover }) => (
          <GlobalItemPrimitive
            isActive={isActive}
            component={this.renderComponent}
            icon={this.renderIcon()}
            isHover={isHover || isHomeViewActive || isPeeking}
            label={label}
            tooltip={!isHomeViewActive && !isPeeking && tooltip}
          />
        )}
      </InteractionStateManager>
    );
  }
}

const PeekToggleWithUIState = (props: *) => (
  <UIStateSubscriber>
    {navigationUI => (
      <PeekToggle
        isPeeking={navigationUI.state.isPeeking}
        navigationUI={navigationUI}
        {...props}
      />
    )}
  </UIStateSubscriber>
);

export default withNavigationViewController(PeekToggleWithUIState);
