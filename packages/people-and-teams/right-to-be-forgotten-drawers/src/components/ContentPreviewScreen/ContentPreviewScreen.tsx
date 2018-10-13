import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button, { ButtonGroup } from '@atlaskit/button';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';

import { commonMessages, contentPreviewMessages } from '../../messages';
import { User } from '../../types';
import UserInfo from '../UserInfo';
import * as Styled from './styled';

interface Props {
  user: User;
  onPrevious: () => void;
  onDeleteAccount: () => void;
}

export class ContentPreviewScreen extends React.Component<Props> {
  render() {
    const { onDeleteAccount, onPrevious, user } = this.props;
    return (
      <Styled.Screen>
        <Styled.Title>
          <FormattedMessage {...contentPreviewMessages.heading} />
        </Styled.Title>
        <UserInfo user={user} />
        Content preview
        <Styled.Footer>
          <Button appearance="subtle-link">
            <FormattedMessage {...commonMessages.learnMore} />{' '}
            <ShortcutIcon size="small" label="" />
          </Button>
          <ButtonGroup>
            <Button onClick={onPrevious}>
              <FormattedMessage {...commonMessages.previous} />
            </Button>
            <Button appearance="primary" onClick={onDeleteAccount}>
              <FormattedMessage {...contentPreviewMessages.deleteAccount} />
            </Button>
          </ButtonGroup>
        </Styled.Footer>
      </Styled.Screen>
    );
  }
}

export default ContentPreviewScreen;
