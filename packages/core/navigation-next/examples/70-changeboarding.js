// @flow

import React, { Component, Fragment } from 'react';
import { Spotlight, SpotlightManager } from '@atlaskit/onboarding';
import Button from '@atlaskit/button';
import ChevronLeft from '@atlaskit/icon/glyph/chevron-left';
import ChevronRight from '@atlaskit/icon/glyph/chevron-right';

import {
  GlobalNav,
  LayoutManager,
  NavigationProvider,
  UIControllerSubscriber,
} from '../src';

const GlobalNavigation = () => (
  <GlobalNav primaryItems={[]} secondaryItems={[]} />
);

const ProductNavigation = () => null;

const ExpandToggleButton = () => (
  <UIControllerSubscriber>
    {navigationUIController => (
      <Button
        iconBefore={
          navigationUIController.state.isCollapsed ? (
            <ChevronRight />
          ) : (
            <ChevronLeft />
          )
        }
        onClick={navigationUIController.toggleCollapse}
      >
        {navigationUIController.state.isCollapsed ? 'Expand' : 'Collapse'} the
        navigation
      </Button>
    )}
  </UIControllerSubscriber>
);

type ExampleState = {
  isChangeboardingOpen: boolean,
};
export default class Example extends Component<{}, ExampleState> {
  state = {
    isChangeboardingOpen: false,
  };
  spotlightTargetNode: ?HTMLElement;
  openChangeboarding = () => {
    this.setState({ isChangeboardingOpen: true });
  };
  closeChangeboarding = () => {
    this.setState({ isChangeboardingOpen: false });
  };
  getCollapseAffordanceRef = ({ expandCollapseAffordance }: *) => {
    this.spotlightTargetNode =
      expandCollapseAffordance && expandCollapseAffordance.current;
  };
  render() {
    const { isChangeboardingOpen } = this.state;

    return (
      <NavigationProvider>
        <SpotlightManager>
          <Fragment>
            <LayoutManager
              globalNavigation={GlobalNavigation}
              productNavigation={ProductNavigation}
              containerNavigation={null}
              onCollapseEnd={this.openChangeboarding}
              getRefs={this.getCollapseAffordanceRef}
            >
              <div css={{ padding: '32px 40px' }}>
                <ExpandToggleButton />
              </div>
            </LayoutManager>
            {isChangeboardingOpen &&
              this.spotlightTargetNode && (
                <Spotlight
                  actions={[
                    { onClick: this.closeChangeboarding, text: 'Close' },
                  ]}
                  dialogPlacement="right bottom"
                  heading="We've got a new collapse state"
                  targetNode={this.spotlightTargetNode}
                  targetRadius={16}
                >
                  <div>Awww yeah.</div>
                </Spotlight>
              )}
          </Fragment>
        </SpotlightManager>
      </NavigationProvider>
    );
  }
}
