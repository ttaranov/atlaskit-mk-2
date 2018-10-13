import * as React from 'react';
import Drawer from '@atlaskit/drawer';
import CrossIcon from '@atlaskit/icon/glyph/cross';

import { Screens } from '../../constants';
import { User } from '../../types';
import OverviewScreen from '../OverviewScreen';
import ContentPreviewScreen from '../ContentPreviewScreen';
import * as Styled from './styled';

interface Props {
  isOpen: boolean;
  deleteAccount: () => void;
  onClose: () => void;
  user: User;
  currentUserId: string;
}

export class DeleteUserDrawer extends React.Component<Props> {
  state = {
    currentScreen: Screens.OVERVIEW,
  };

  screens = [Screens.OVERVIEW, Screens.CONTENT_PREVIEW];

  nextScreen = () => {
    const currentScreenIdx = this.screens.indexOf(this.state.currentScreen);
    const nextScreen =
      currentScreenIdx < this.screens.length - 1
        ? currentScreenIdx + 1
        : this.screens.length - 1;
    this.setState({ currentScreen: this.screens[nextScreen] });
  };

  previousScreen = () => {
    const currentScreenIdx = this.screens.indexOf(this.state.currentScreen);
    const previousScreen = currentScreenIdx - 1 >= 0 ? currentScreenIdx - 1 : 0;
    this.setState({ currentScreen: this.screens[previousScreen] });
  };

  render() {
    const { currentUserId, deleteAccount, isOpen, onClose, user } = this.props;
    return (
      <Drawer icon={CrossIcon} isOpen={isOpen} onClose={onClose} width="full">
        <Styled.DrawerInner>
          {this.state.currentScreen === Screens.OVERVIEW && (
            <OverviewScreen
              isCurrentUser={user.id === currentUserId}
              onCancel={this.props.onClose}
              onNext={this.nextScreen}
              user={user}
            />
          )}
          {this.state.currentScreen === Screens.CONTENT_PREVIEW && (
            <ContentPreviewScreen
              onPrevious={this.previousScreen}
              onDeleteAccount={deleteAccount}
              user={user}
            />
          )}
        </Styled.DrawerInner>
      </Drawer>
    );
  }
}

export default DeleteUserDrawer;
