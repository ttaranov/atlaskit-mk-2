// @flow

import React, { Fragment, Component } from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import Modal from '@atlaskit/modal-dialog';
import Lorem from 'react-lorem-component';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';

import GlobalNavigation from '../src';

type State = {
  isCreateModalOpen: boolean,
  isSearchDrawerOpen: boolean,
  notificationCount: number,
};

const DrawerContent = ({
  drawerTitle,
  drawerBody,
}: {
  drawerTitle: string,
  drawerBody: string,
}) => (
  <div>
    <h1
      css={{
        textTransform: 'capitalize',
      }}
    >
      {drawerTitle}
    </h1>
    <div>{drawerBody}</div>
  </div>
);

class GlobalNavWithDrawers extends Component<{}, State> {
  state = {
    isCreateModalOpen: false,
    isSearchDrawerOpen: false,
    notificationCount: 5,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyboardShortcut);
  }

  handleKeyboardShortcut(e) {
    if (e.key === '\\') {
      if (this.state.isSearchDrawerOpen) return this.closeSearchDrawer();

      return this.openSearchDrawer();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyboardShortcut);
  }

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

  openSearchDrawer = () => {
    this.setState({
      isSearchDrawerOpen: true,
    });
  };

  closeSearchDrawer = () => {
    this.setState({
      isSearchDrawerOpen: false,
    });
  };

  updateNotifications = () => {
    this.setState({
      notificationCount: 5,
    });
  };

  resetNotificationCount = () => {
    this.setState({
      notificationCount: 0,
    });
  };

  secondaryAction = ({ target }: Object) => console.log(target.innerText);

  render() {
    const actions = [
      { text: 'Close', onClick: this.closeCreateModal },
      { text: 'Secondary Action', onClick: this.secondaryAction },
    ];

    return (
      <Fragment>
        <GlobalNavigation
          productIcon={EmojiAtlassianIcon}
          onCreateClick={this.openCreateModal}
          onProductClick={() => console.log('product clicked')}
          onSearchClick={this.openSearchDrawer}
          searchTooltip="Search (\)"
          isSearchDrawerOpen={this.state.isSearchDrawerOpen}
          searchDrawerContents={() => (
            <DrawerContent
              drawerTitle="Controlled Search Drawer"
              drawerBody="Can be controlled by passing the onSearchClick prop"
            />
          )}
          onSearchDrawerClose={this.closeSearchDrawer}
          starredDrawerContents={() => (
            <DrawerContent
              drawerTitle="Starred Drawer"
              drawerBody="Sets notification count to 5 in `onStarredDrawerOpen` callback"
            />
          )}
          onStarredDrawerOpen={this.updateNotifications}
          notificationDrawerContents={() => (
            <DrawerContent
              drawerTitle="Notification Drawer"
              drawerBody="Resets notification count in `onNotificationDrawerOpen` callback"
            />
          )}
          onNotificationDrawerOpen={this.resetNotificationCount}
          notificationCount={this.state.notificationCount}
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
      </Fragment>
    );
  }
}

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={props => <GlobalNavWithDrawers {...props} />}
      productNavigation={() => null}
      containerNavigation={() => null}
    >
      <Fragment>
        <div>Page content</div>
      </Fragment>
    </LayoutManager>
  </NavigationProvider>
);
