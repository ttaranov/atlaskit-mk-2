import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@atlaskit/button';
import Drawer from '@atlaskit/drawer';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';

import { Screens } from '../../constants';
import { User } from '../../types';
import OverviewScreen from '../OverviewScreen';
import ContentPreviewScreen from '../ContentPreviewScreen';
import * as Styled from './styled';
import Footer from '../Footer';
import { commonMessages } from '../../messages';

interface Props {
  isOpen: boolean;
  deleteAccount: () => void;
  onClose: () => void;
  user: User;
  currentUserId: string;
}

export class DeleteUserDrawer extends React.Component<Props> {
  state = {
    currentScreenId: Screens.OVERVIEW,
  };

  screens = [
    {
      id: Screens.OVERVIEW,
      component: (
        <OverviewScreen
          isCurrentUser={this.props.user.id === this.props.currentUserId}
          user={this.props.user}
        />
      ),
    },
    {
      id: Screens.CONTENT_PREVIEW,
      component: <ContentPreviewScreen user={this.props.user} />,
    },
  ];

  getScreenIndexById = screenId =>
    this.screens.findIndex(s => s.id === screenId);

  nextScreen = () => {
    const currentScreenIdx = this.getScreenIndexById(
      this.state.currentScreenId,
    );
    const nextScreenIdx =
      currentScreenIdx < this.screens.length - 1
        ? currentScreenIdx + 1
        : this.screens.length - 1;
    this.setState({ currentScreenId: this.screens[nextScreenIdx].id });
  };

  previousScreen = () => {
    const currentScreenIdx = this.getScreenIndexById(
      this.state.currentScreenId,
    );
    const previousScreenIdx =
      currentScreenIdx - 1 >= 0 ? currentScreenIdx - 1 : 0;
    this.setState({ currentScreenId: this.screens[previousScreenIdx].id });
  };

  renderCurrentScreen = () => {
    const currentScreen = this.screens.find(
      s => s.id === this.state.currentScreenId,
    );
    return currentScreen && currentScreen.component;
  };

  render() {
    const { deleteAccount, isOpen, onClose, user } = this.props;
    return (
      <Drawer
        icon={props => <CrossIcon label="" {...props} size="medium" />}
        isOpen={isOpen}
        onClose={onClose}
        width="full"
      >
        <Styled.DrawerInner>
          {this.renderCurrentScreen()}

          <Footer
            numScreens={this.screens.length}
            currentScreenIdx={this.getScreenIndexById(
              this.state.currentScreenId,
            )}
            onCancel={onClose}
            onNext={this.nextScreen}
            onPrevious={this.previousScreen}
            secondaryActions={
              <Button appearance="subtle-link" spacing="none">
                <FormattedMessage {...commonMessages.learnMore} />{' '}
                <ShortcutIcon size="small" label="" />
              </Button>
            }
            submitButton={
              <Button appearance="primary" onClick={deleteAccount}>
                <FormattedMessage {...commonMessages.deleteAccount} />
              </Button>
            }
          />
        </Styled.DrawerInner>
      </Drawer>
    );
  }
}

export default DeleteUserDrawer;
