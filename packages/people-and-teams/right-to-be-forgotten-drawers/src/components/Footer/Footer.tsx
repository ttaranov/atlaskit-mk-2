import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button, { ButtonGroup } from '@atlaskit/button';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';

import { commonMessages } from '../../messages';
import * as Styled from './styled';

interface FooterProps {
  currentScreenIdx: number;
  numScreens: number;
  submitButton: React.ReactNode;
  onNext: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  secondaryActions: React.ReactNode;
}

export default class Footer extends React.Component<FooterProps> {
  render() {
    const {
      currentScreenIdx,
      numScreens,
      onCancel,
      onNext,
      onPrevious,
      submitButton,
    } = this.props;
    return (
      <Styled.FooterOuter>
        <Button appearance="subtle-link" spacing="none">
          <FormattedMessage {...commonMessages.learnMore} />{' '}
          <ShortcutIcon size="small" label="" />
        </Button>

        <ButtonGroup>
          {currentScreenIdx < 1 ? (
            <Button onClick={onCancel}>Cancel</Button>
          ) : (
            <Button onClick={onPrevious}>Previous</Button>
          )}

          {currentScreenIdx < numScreens - 1 ? (
            <Button appearance="primary" onClick={onNext}>
              Next
            </Button>
          ) : (
            submitButton
          )}
        </ButtonGroup>
      </Styled.FooterOuter>
    );
  }
}
