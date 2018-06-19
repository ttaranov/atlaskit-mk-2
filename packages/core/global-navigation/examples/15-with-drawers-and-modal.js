// @flow

import React, { Fragment, Component } from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import Modal from '@atlaskit/modal-dialog';
import Lorem from 'react-lorem-component';
import {
  LayoutManager,
  NavigationProvider,
  NavigationSubscriber,
} from '@atlaskit/navigation-next';

import GlobalNavigation from '../src';
import Drawer from '../src/components/Drawer';

type State = {
  isModalOpen: boolean,
};

const DrawerContent = ({
  closeDrawer,
  drawerText,
}: {
  closeDrawer: () => void,
  drawerText: string,
}) => (
  <div>
    <div>{drawerText}</div>
    <button onClick={closeDrawer}>Close Drawer</button>
  </div>
);

class GlobalNavWithDrawers extends Component<Object, State> {
  state = {
    isModalOpen: false,
  };

  openModal = () => {
    this.setState({
      isModalOpen: true,
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  secondaryAction = ({ target }: Object) => console.log(target.innerText);

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
          drawerText={`${drawerKey} drawer`}
        />
      </Drawer>
    );
  };
  render() {
    const actions = [
      { text: 'Close', onClick: this.closeModal },
      { text: 'Secondary Action', onClick: this.secondaryAction },
    ];

    return (
      <Fragment>
        <GlobalNavigation
          productIcon={EmojiAtlassianIcon}
          onProductClick={() => console.log('product clicked')}
          onCreateClick={this.openModal}
          onSearchClick={this.props.navigation.openSearchDrawer}
          onYourWorkClick={this.props.navigation.openYourWorkDrawer}
          onNotificationClick={this.props.navigation.openNotificationDrawer}
          notificationCount={5}
          onPeopleClick={this.props.navigation.openPeopleDrawer}
        />
        {this.renderDrawer('search', { width: 'wide' })}
        {this.renderDrawer('notification', { width: 'wide' })}
        {this.renderDrawer('people', { width: 'wide' })}
        {this.state.isModalOpen && (
          <Modal
            actions={actions}
            onClose={this.closeModal}
            heading="Modal Title"
          >
            <Lorem count={2} />
          </Modal>
        )}
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
