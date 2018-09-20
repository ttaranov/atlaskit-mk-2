// @flow

import React, { Fragment, Component } from 'react';

import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import Lorem from 'react-lorem-component';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';

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
    <label htmlFor="textbox" css={{ display: 'block' }}>
      Type something in the textarea below and see if it is retained
    </label>
    <textarea input="textbox" type="text" rows="50" cols="50" />
  </div>
);

type State = {
  isCreateModalOpen: boolean,
  isSearchDrawerOpen: boolean,
  notificationCount: number,
};

type Props = {
  isCreateDrawerEnabled: boolean,
  unmountOnExit: boolean,
};

const HelpDropdown = () => (
  <DropdownItemGroup title="Heading">
    <DropdownItem>Hello it with some really quite long text here.</DropdownItem>
    <DropdownItem>Some text 2</DropdownItem>
    <DropdownItem isDisabled>Some disabled text</DropdownItem>
    <DropdownItem>Some more text</DropdownItem>
    <DropdownItem href="//atlassian.com" target="_new">
      A link item
    </DropdownItem>
  </DropdownItemGroup>
);

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

    const { isCreateDrawerEnabled, unmountOnExit } = this.props;

    return (
      <Fragment>
        <GlobalNavigation
          helpItems={HelpDropdown}
          productIcon={EmojiAtlassianIcon}
          onCreateClick={isCreateDrawerEnabled ? this.openCreateModal : null}
          createDrawerContents={() => (
            <DrawerContent
              drawerTitle="Create Modal"
              drawerBody="You can toggle between a search drawer and the search modal"
            />
          )}
          shouldCreateDrawerUnmountOnExit={unmountOnExit}
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
          shouldSearchDrawerUnmountOnExit={unmountOnExit}
          starredDrawerContents={() => (
            <DrawerContent
              drawerTitle="Starred Drawer"
              drawerBody="Sets notification count to 5 in `onStarredDrawerOpen` callback"
            />
          )}
          onStarredDrawerOpen={this.updateNotifications}
          shouldStarredDrawerUnmountOnExit={unmountOnExit}
          notificationDrawerContents={() => (
            <DrawerContent
              drawerTitle="Notification Drawer"
              drawerBody="Resets notification count in `onNotificationDrawerOpen` callback"
            />
          )}
          onNotificationDrawerOpen={this.resetNotificationCount}
          notificationCount={this.state.notificationCount}
          shouldNotificationDrawerUnmountOnExit={unmountOnExit}
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
  shouldUnmountOnExit: boolean,
};

// Need two componentss because both have state
// eslint-disable-next-line react/no-multi-comp
export default class extends Component<{||}, NavState> {
  state = {
    isCreateDrawerEnabled: true,
    shouldUnmountOnExit: true,
  };

  toggleCreateDrawer = () => {
    this.setState(prevState => ({
      isCreateDrawerEnabled: !prevState.isCreateDrawerEnabled,
    }));
  };

  toggleUnmountBehaviour = () => {
    this.setState(({ shouldUnmountOnExit: unmountOnExitValue }) => ({
      shouldUnmountOnExit: !unmountOnExitValue,
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
              unmountOnExit={this.state.shouldUnmountOnExit}
            />
          )}
          productNavigation={() => null}
          containerNavigation={() => null}
        >
          <div css={{ padding: '32px 40px' }}>
            <div>Page content</div>
            <button onClick={this.toggleCreateDrawer}>{`Enable ${
              this.state.isCreateDrawerEnabled
                ? 'Create Drawer'
                : 'Create Modal'
            }`}</button>

            <div css={{ marginTop: '2rem' }}>
              <label htmlFor="checkbox">
                <input
                  id="checkbox"
                  type="checkbox"
                  value={this.state.shouldUnmountOnExit}
                  onChange={this.toggleUnmountBehaviour}
                />
                Toggle remounting of drawer contents on exit
              </label>
              <div css={{ display: 'block', paddingTop: '1rem' }}>
                Contents of the drawer will be{' '}
                <strong>{`${
                  this.state.shouldUnmountOnExit ? 'discarded' : 'retained'
                }`}</strong>{' '}
                on closing the drawer
              </div>
            </div>
          </div>
        </LayoutManager>
      </NavigationProvider>
    );
  }
}
