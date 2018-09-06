// @flow

import React, { Fragment, Component } from 'react';

import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Lorem from 'react-lorem-component';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';

import GlobalNavigation from '../src';

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

type State = {
  isCreateModalOpen: boolean,
  isSearchDrawerOpen: boolean,
  notificationCount: number,
};

type Props = {
  isCreateDrawerEnabled: boolean,
};

class GlobalNavWithDrawers extends Component<Props, State> {
  state = {
    isCreateModalOpen: false,
    isSearchDrawerOpen: false,
    notificationCount: 5,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyboardShortcut);
  }

  handleKeyboardShortcut = e => {
    if (e.key === '\\') {
      if (this.state.isSearchDrawerOpen) return this.closeSearchDrawer();

      return this.openSearchDrawer();
    }
    return null;
  };

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

    const { isCreateDrawerEnabled } = this.props;

    return (
      <Fragment>
        <GlobalNavigation
          productIcon={EmojiAtlassianIcon}
          onCreateClick={isCreateDrawerEnabled ? this.openCreateModal : null}
          createDrawerContents={() => (
            <DrawerContent
              drawerTitle="Create Modal"
              drawerBody="You can toggle between a search drawer and the search modal"
            />
          )}
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
        <ModalTransition>
          {this.state.isCreateModalOpen && (
            <Modal
              actions={actions}
              onClose={this.closeCreateModal}
              heading="Modal Title"
            >
              <Lorem count={2} />
            </Modal>
          )}
        </ModalTransition>
      </Fragment>
    );
  }
}

type NavState = {
  isCreateDrawerEnabled: boolean,
};

// Need two componentss because both have state
// eslint-disable-next-line react/no-multi-comp
export default class extends Component<{||}, NavState> {
  state = {
    isCreateDrawerEnabled: true,
  };

  toggleCreateDrawer = () => {
    this.setState(prevState => ({
      isCreateDrawerEnabled: !prevState.isCreateDrawerEnabled,
    }));
  };

  render() {
    return (
      <NavigationProvider>
        <LayoutManager
          globalNavigation={props => (
            <GlobalNavWithDrawers
              {...props}
              isCreateDrawerEnabled={this.state.isCreateDrawerEnabled}
            />
          )}
          productNavigation={() => null}
          containerNavigation={() => null}
        >
          <Fragment>
            <div>Page content</div>
            <button onClick={this.toggleCreateDrawer}>{`Enable ${
              this.state.isCreateDrawerEnabled
                ? 'Create Drawer'
                : 'Create Modal'
            }`}</button>
          </Fragment>
        </LayoutManager>
      </NavigationProvider>
    );
  }
}
