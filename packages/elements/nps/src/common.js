//@flow

import React, { type Node } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import CloseIcon from '@atlaskit/icon/glyph/cross';
import { Header as StyledHeader } from './styled/common';

export function HeaderButtons({
  optOutLabel,
  isDismissable,
  onDismiss,
  canOptOut,
  onOptOut,
}: {
  optOutLabel?: Node,
  isDismissable: boolean,
  onDismiss?: () => void,
  canOptOut: boolean,
  onOptOut?: () => void,
}) {
  const buttons = [];
  if (canOptOut) {
    buttons.push(
      <Button onClick={onOptOut} appearance="subtle">
        {optOutLabel}
      </Button>,
    );
  }
  if (isDismissable) {
    buttons.push(
      <Button
        appearance="subtle"
        onClick={onDismiss}
        iconBefore={<CloseIcon label="Close" size="small" />}
      />,
    );
  }
  return <ButtonGroup>{buttons}</ButtonGroup>;
}

export function Header({
  title,
  isDismissable,
  onDismiss,
  canOptOut,
  onOptOut,
  optOutLabel,
}: {
  title: Node,
  isDismissable: boolean,
  onDismiss?: () => void,
  canOptOut: boolean,
  onOptOut?: () => void,
  optOutLabel?: Node,
}) {
  return (
    <StyledHeader>
      <h2>{title}</h2>
      <HeaderButtons
        isDismissable={isDismissable}
        canOptOut={canOptOut}
        onDismiss={onDismiss}
        onOptOut={onOptOut}
        optOutLabel={optOutLabel}
      />
    </StyledHeader>
  );
}
