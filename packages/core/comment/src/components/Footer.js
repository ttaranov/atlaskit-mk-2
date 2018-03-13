// @flow

import React, { type Node } from 'react';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import {
  ActionsContainer,
  ActionsItem,
  ErrorIcon,
} from '../styled/FooterStyles';

type Props = {
  actions?: Array<Node>,
  errorActions?: Array<Node>,
  errorIconLabel?: string,
  isError?: boolean,
  isSaving?: boolean,
};

const mapActions = items =>
  items.map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <ActionsItem key={index}>{item}</ActionsItem>
  ));

const FooterItems = ({
  actions,
  errorActions,
  errorIconLabel,
  isError,
  isSaving,
}: Props) => {
  if (isSaving || (!actions && !errorActions)) return null;

  const items = isError
    ? errorActions && mapActions(errorActions)
    : actions && mapActions(actions);

  return (
    <ActionsContainer>
      {isError ? (
        <ErrorIcon>
          <WarningIcon label={errorIconLabel} />
        </ErrorIcon>
      ) : null}
      {items}
    </ActionsContainer>
  );
};

export default FooterItems;
