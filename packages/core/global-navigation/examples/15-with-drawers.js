// @flow

import React, { Fragment, Component } from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import {
  LayoutManager,
  NavigationProvider,
  NavigationSubscriber,
} from '@atlaskit/navigation-next';

import GlobalNavigation from '../src/components/GlobalNavigation';
import Drawer from '../src/components/Drawer';

type State = {
  notificationCount: number,
};

const DrawerContent = ({
  closeDrawer,
  drawerBody,
  clearNotification,
}: {
  closeDrawer: () => void,
  clearNotification: () => void,
  drawerBody: string,
}) => (
  <div>
    <div>{drawerBody}</div>
    <button onClick={closeDrawer}>Close Drawer</button>
    {drawerBody.startsWith('notification') && (
      <button onClick={clearNotification}>Clear Notification</button>
    )}
  </div>
);

class GlobalNavWithDrawers extends Component<Object, State> {
  state = {
    notificationCount: 1,
  };

  dialogRef = null;

  openModal = () => {
    // $FlowFixMe
    this.dialogRef.showModal();
  };

  closeModal = () => {
    // $FlowFixMe
    this.dialogRef.close();
  };

  clearNotification = () => {
    this.setState(() => ({
      notificationCount: 0,
    }));
  };

  renderDrawer = (
    drawerKey: 'create' | 'search' | 'notification' | 'people',
    drawerProps,
  ) => {
    const { navigation } = this.props;
    const { activeDrawer } = navigation.state;

    const closeDrawer = () => {
      navigation[
        `close${drawerKey.charAt(0).toUpperCase()}${drawerKey.slice(1)}Drawer`
      ]();
    };

    return (
      <Drawer
        isOpen={activeDrawer === drawerKey}
        onClose={closeDrawer}
        {...drawerProps}
      >
        <DrawerContent
          closeDrawer={closeDrawer}
          clearNotification={this.clearNotification}
          drawerBody={`${drawerKey} drawer`}
        />
      </Drawer>
    );
  };
  render() {
    return (
      <Fragment>
        <GlobalNavigation
          productIcon={EmojiAtlassianIcon}
          onCreateClick={this.openModal}
          onProductClick={() => console.log('product clicked')}
          onSearchClick={this.props.navigation.openSearchDrawer}
          onYourWorkClick={this.props.navigation.openYourWorkDrawer}
          onNotificationClick={this.props.navigation.openNotificationDrawer}
          notificationCount={this.state.notificationCount}
          onPeopleClick={this.props.navigation.openPeopleDrawer}
        />
        {this.renderDrawer('search', { width: 'wide' })}
        {this.renderDrawer('notification', { width: 'wide' })}
        {this.renderDrawer('people', { width: 'wide' })}
        <dialog
          ref={element => {
            this.dialogRef = element;
          }}
        >
          <div>Create Modal</div>
          <button onClick={this.closeModal}>Close Modal</button>
        </dialog>
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
