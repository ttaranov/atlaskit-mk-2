// @flow

import React, { Component } from 'react';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';

import { GlobalItemPrimitive } from '../../';
import InteractionStateManager from '../InteractionStateManager';
import { UIState, UIStateSubscriber } from '../../ui-state';
import { ViewState, withNavigationViews } from '../../view-state';

type PeekToggleProps = {
  label: string,
  tooltip: string,
  isPeeking: boolean,
  navigationUI: UIState,
  navigationViews: ViewState,
};

type PeekToggleState = {
  isPeeking: boolean,
};

class PeekToggle extends Component<PeekToggleProps, PeekToggleState> {
  static defaultProps = {
    label: 'Main menu',
    tooltip: 'Main menu',
  };

  state = {
    isPeeking: this.props.isPeeking,
  };

  nestedRootView: ?string = null;

  componentDidUpdate(prevProps: PeekToggleProps) {
    const { isPeeking } = this.props;
    const { isPeeking: wasPeeking } = prevProps;
    if (isPeeking !== wasPeeking) {
      if (isPeeking) {
        this.peek();
      } else {
        this.unPeek();
      }
    }
  }

  peek = () => {
    const { navigationUI } = this.props;
    navigationUI.peek();
    this.setState({ isPeeking: true });
    this.activateHomeView();
  };

  unPeek = () => {
    const { navigationUI } = this.props;
    navigationUI.unPeek();
    this.setState({ isPeeking: false });
    this.deactivateHomeView();
  };

  handleMouseEnter = () => {
    this.props.navigationUI.peekHint();
  };

  handleMouseLeave = () => {
    this.props.navigationUI.unPeekHint();
  };

  handleClick = () => {
    const { isPeeking } = this.state;
    if (isPeeking) {
      this.unPeek();
    } else {
      this.peek();
    }
  };

  activateHomeView() {
    const { navigationViews } = this.props;
    const { productViewId, homeViewId } = navigationViews.state;
    if (homeViewId && homeViewId !== productViewId) {
      navigationViews.setView(homeViewId);
      this.nestedRootView = productViewId;
    }
  }

  deactivateHomeView() {
    const { navigationViews } = this.props;
    if (this.nestedRootView) {
      navigationViews.setView(this.nestedRootView);
    }
    this.nestedRootView = null;
  }

  getIsHomeViewActive() {
    const {
      containerViewId,
      homeViewId,
      productViewId,
    } = this.props.navigationViews.state;
    return (
      !containerViewId &&
      homeViewId &&
      productViewId &&
      homeViewId === productViewId
    );
  }

  renderIcon = () =>
    this.props.navigationUI.state.isPeeking ? ArrowLeftIcon : MenuIcon;

  renderComponent = ({ className, children }) => {
    const isHomeViewActive = this.getIsHomeViewActive();
    const { isPeeking } = this.state;

    return (
      <button
        className={className}
        onClick={isHomeViewActive && !isPeeking ? null : this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {children}
      </button>
    );
  };

  render() {
    const { label, tooltip } = this.props;
    const { isPeeking } = this.state;
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

export default withNavigationViews(PeekToggleWithUIState);
