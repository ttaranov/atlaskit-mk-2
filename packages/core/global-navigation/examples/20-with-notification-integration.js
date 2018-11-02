// @flow

import React, { Component } from 'react';
import fetchMock from 'fetch-mock';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import Button from '@atlaskit/button';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';

import GlobalNavigation from '../src';

const fabricNotificationLogUrl = '/gateway/api/notification-log/';
const cloudId = 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b';

const Global = ({
  resetNotificationCount,
}: {
  resetNotificationCount: () => void,
}) => (
  <GlobalNavigation
    productIcon={EmojiAtlassianIcon}
    productHref="#"
    fabricNotificationLogUrl={fabricNotificationLogUrl}
    onNotificationDrawerClose={() => {
      // setTimeout is required to let the drawer close animation end in the example.
      setTimeout(resetNotificationCount, 350);
    }}
    cloudId={cloudId}
  />
);

export default class GlobalNavigationWithNotificationIntegration extends Component<
  {},
  { count: number },
> {
  state = { count: 5 };

  componentDidMount() {
    const { count } = this.state;
    fetchMock.mock(
      new RegExp(fabricNotificationLogUrl),
      Promise.resolve({ count }),
    );
  }

  componentDidUpdate() {
    const { count } = this.state;
    fetchMock.restore();
    fetchMock.mock(
      new RegExp(fabricNotificationLogUrl),
      Promise.resolve({ count }),
    );
  }

  componentWillUnmount() {
    fetchMock.restore();
  }

  resetNotificationCount = () => {
    this.setState({
      count: 0,
    });
  };

  randomiseNotificationCount = () => {
    this.setState({
      count: Math.floor(1 + Math.random() * 18), // To ensure equal probability of count above and below 9
    });
  };

  render() {
    return (
      <NavigationProvider>
        <LayoutManager
          globalNavigation={() => (
            <Global resetNotificationCount={this.resetNotificationCount} />
          )}
          productNavigation={() => null}
          containerNavigation={() => null}
        >
          <div css={{ padding: '32px 40px' }}>
            <p>
              <Button onClick={this.randomiseNotificationCount}>
                Randomise Notification Count
              </Button>
            </p>
            <p>
              <Button onClick={this.resetNotificationCount}>
                Reset Notification Count
              </Button>
            </p>
          </div>
        </LayoutManager>
      </NavigationProvider>
    );
  }
}
