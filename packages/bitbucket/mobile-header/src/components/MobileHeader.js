// @flow
import React, { Fragment, PureComponent, type Node } from 'react';
import Button from '@atlaskit/button';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import * as styles from '../styled';

type MobileHeaderProps = {
  navigation: (isOpen: boolean) => Node,
  sidebar: (isOpen: boolean) => Node,
  onNavigationOpen: () => void,
  onDrawerClose: () => void,
  drawerState: 'navigation' | 'sidebar' | 'none',
  secondaryContent?: Node,
  pageHeading: Node,
  menuIconLabel: string,
};

type MobileHeaderState = {
  isAnimatingSidebar: boolean,
  isAnimatingNavigation: boolean,
};

class MobileHeader extends PureComponent<MobileHeaderProps, MobileHeaderState> {
  state = {
    isAnimatingNavigation: false,
    isAnimatingSidebar: false,
  };

  componentWillReceiveProps(nextProps: MobileHeaderProps) {
    if (nextProps.drawerState === 'none') {
      if (this.props.drawerState === 'navigation') {
        this.setState({ isAnimatingNavigation: true });
      } else if (this.props.drawerState === 'sidebar') {
        this.setState({ isAnimatingSidebar: true });
      }
    }
  }

  handleNavSlideFinish = () => {
    this.setState({ isAnimatingNavigation: false });
  };

  handleSidebarSlideFinish = () => {
    this.setState({ isAnimatingSidebar: false });
  };

  renderSlider = (
    isOpen: boolean,
    isAnimating: boolean,
    renderFn: (isOpen: boolean) => Node,
    onTransitionEnd: Function,
    side: string = 'left',
  ) => (
    <styles.MobileNavSlider
      isOpen={isOpen}
      onTransitionEnd={onTransitionEnd}
      side={side}
    >
      {(isOpen || isAnimating) && renderFn(isOpen)}
    </styles.MobileNavSlider>
  );

  render() {
    const { isAnimatingNavigation, isAnimatingSidebar } = this.state;
    const { drawerState, menuIconLabel } = this.props;
    const isNavigationOpen = drawerState === 'navigation';
    const isSidebarOpen = drawerState === 'sidebar';

    return (
      <Fragment>
        <styles.MobilePageHeader>
          <styles.MobilePageHeaderContent>
            <Button
              appearance="subtle"
              iconBefore={<MenuIcon label={menuIconLabel} size="large" />}
              onClick={this.props.onNavigationOpen}
            />
            <styles.PageHeading>{this.props.pageHeading}</styles.PageHeading>
            {this.props.secondaryContent}
          </styles.MobilePageHeaderContent>
        </styles.MobilePageHeader>

        {this.renderSlider(
          isNavigationOpen,
          isAnimatingNavigation,
          this.props.navigation,
          this.handleNavSlideFinish,
        )}

        {this.renderSlider(
          isSidebarOpen,
          isAnimatingSidebar,
          this.props.sidebar,
          this.handleSidebarSlideFinish,
          'right',
        )}

        {(isNavigationOpen ||
          isSidebarOpen ||
          isAnimatingNavigation ||
          isAnimatingSidebar) && (
          <styles.FakeBlanket
            isOpen={isNavigationOpen || isSidebarOpen}
            onClick={this.props.onDrawerClose}
          />
        )}
      </Fragment>
    );
  }
}

export default MobileHeader;
