// @flow

import React, { Fragment, Component } from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import Modal from '@atlaskit/modal-dialog';
import Drawer from '@atlaskit/drawer';
import Lorem from 'react-lorem-component';
import {
  LayoutManager,
  NavigationProvider,
  NavigationSubscriber,
} from '@atlaskit/navigation-next';

import GlobalNavigation from '../src';

type State = {
  isCreateModalOpen: boolean,
  isSearchDrawerOpen: boolean,
  isNotificationDrawerOpen: boolean,
  isPeopleDrawerOpen: boolean,
  isYourWorkOpen: boolean,
  notificationCount: number,
};

const DrawerContent = ({
  closeDrawer,
  drawerText,
}: {
  closeDrawer: () => void,
  drawerText: string,
}) => (
  <div>
    <h1>
      <code>{`${drawerText[0].toUpperCase()}${drawerText.slice(1)}`}</code>
    </h1>
    <button
      onClick={closeDrawer}
      css={{
        marginTop: '3rem',
      }}
    >
      Close Drawer
    </button>
  </div>
);

class GlobalNavWithDrawers extends Component<Object, State> {
  state = {
    isCreateModalOpen: false,
    isSearchDrawerOpen: false,
    isNotificationDrawerOpen: false,
    isPeopleDrawerOpen: false,
    isYourWorkOpen: false,
    notificationCount: 0,
  };

  drawers = ['search', 'notification', 'people', 'yourWork'];
  widths = {
    search: 'wide',
    yourWork: 'wide',
    notification: 'narrow',
    people: 'full',
  };

  openCreateModal = () => {
    this.setState({
      isCreateModalOpen: true,
    });
  };

  closeCreateModal = () => {
    this.setState({
      isCreateModalOpen: false,
    });
  };

  secondaryAction = ({ target }: Object) => console.log(target.innerText);

  getDrawerStateKey = drawerName =>
    `is${drawerName[0].toUpperCase()}${drawerName.slice(1)}Open`;

  isDrawerOpen = drawer => {
    return this.state[this.getDrawerStateKey(drawer)];
  };

  closeDrawer = drawer => () => {
    this.setState({
      [this.getDrawerStateKey(drawer)]: false,
      ...(drawer === 'notification' ? { notificationCount: 0 } : null),
    });
  };

  openDrawer = drawer => () => {
    this.setState(({ notificationCount }) => ({
      [this.getDrawerStateKey(drawer)]: true,
      ...(drawer !== 'notification'
        ? {
            notificationCount: notificationCount + 1,
          }
        : null),
    }));
  };

  renderDrawers = () => {
    return this.drawers.map(drawer => (
      <Drawer
        onClose={this.closeDrawer(drawer)}
        isOpen={this.isDrawerOpen(drawer)}
        width={this.widths[drawer]}
        key={drawer}
      >
        <DrawerContent
          closeDrawer={this.closeDrawer(drawer)}
          drawerText={`${drawer} Drawer`}
        />
      </Drawer>
    ));
  };

  render() {
    const actions = [
      { text: 'Close', onClick: this.closeCreateModal },
      { text: 'Secondary Action', onClick: this.secondaryAction },
    ];

    return (
      <Fragment>
        <GlobalNavigation
          productIcon={EmojiAtlassianIcon}
          onProductClick={() => console.log('product clicked')}
          onCreateClick={this.openCreateModal}
          onSearchClick={this.openDrawer('search')}
          onYourWorkClick={this.openDrawer('yourWork')}
          onNotificationClick={this.openDrawer('notification')}
          notificationCount={this.state.notificationCount}
          onPeopleClick={this.openDrawer('people')}
        />
        {this.state.isCreateModalOpen && (
          <Modal
            actions={actions}
            onClose={this.closeCreateModal}
            heading="Modal Title"
          >
            <Lorem count={2} />
          </Modal>
        )}
        {this.renderDrawers()}
      </Fragment>
    );
  }
}

export default () => (
  <NavigationProvider>
    <NavigationSubscriber>
      {navigation => (
        <LayoutManager
          globalNavigation={props => (
            <GlobalNavWithDrawers {...props} navigation={navigation} />
          )}
          productRootNavigation={() => null}
          productContainerNavigation={() => null}
        >
          <div>Page content</div>
        </LayoutManager>
      )}
    </NavigationSubscriber>
  </NavigationProvider>
);
