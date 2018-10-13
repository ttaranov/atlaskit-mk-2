import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@atlaskit/button';
import Drawer from '@atlaskit/drawer';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';

import * as Styled from './styled';
import Footer from '../Footer';
import { commonMessages } from '../../messages';

interface Props {
  isOpen: boolean;
  deleteAccount: () => void;
  onClose: () => void;
  screens: React.ReactNode[];
}

export class RightToBeForgottenDrawer extends React.Component<Props> {
  state = {
    currentScreenIdx: 0,
  };

  nextScreen = () => {
    const { screens } = this.props;
    const { currentScreenIdx } = this.state;
    const nextScreenIdx =
      currentScreenIdx < screens.length - 1
        ? currentScreenIdx + 1
        : screens.length - 1;
    this.setState({ currentScreenIdx: nextScreenIdx });
  };

  previousScreen = () => {
    const { currentScreenIdx } = this.state;
    const previousScreenIdx =
      currentScreenIdx - 1 >= 0 ? currentScreenIdx - 1 : 0;
    this.setState({ currentScreenIdx: previousScreenIdx });
  };

  renderCurrentScreen = () => {
    const currentScreen = this.props.screens[this.state.currentScreenIdx];
    return currentScreen;
  };

  render() {
    const { deleteAccount, isOpen, onClose, screens } = this.props;
    const { currentScreenIdx } = this.state;
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
            numScreens={screens.length}
            currentScreenIdx={currentScreenIdx}
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

export default RightToBeForgottenDrawer;
