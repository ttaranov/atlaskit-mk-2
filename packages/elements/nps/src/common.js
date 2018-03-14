//@flow

import React, { type Node } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import CloseIcon from '@atlaskit/icon/glyph/cross';
import {
  Wrapper,
  Header as StyledHeader,
  Title,
  Description as StyledDescription,
} from './styled/common';

export function HeaderButtons({
  optOutLabel,
  isDismissible,
  onDismiss,
  canOptOut,
  onOptOut,
}: {
  optOutLabel?: Node,
  isDismissible: boolean,
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
  if (isDismissible) {
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
  isDismissible,
  onDismiss,
  canOptOut,
  onOptOut,
  optOutLabel,
}: {
  title: Node,
  isDismissible: boolean,
  onDismiss?: () => void,
  canOptOut: boolean,
  onOptOut?: () => void,
  optOutLabel?: Node,
}) {
  return (
    <StyledHeader>
      <Title>{title}</Title>
      <HeaderButtons
        isDismissible={isDismissible}
        canOptOut={canOptOut}
        onDismiss={onDismiss}
        onOptOut={onOptOut}
        optOutLabel={optOutLabel}
      />
    </StyledHeader>
  );
}

export function Description({ children }: { children: Node }): Node {
  return (
    <Wrapper>
      <StyledDescription>{children}</StyledDescription>
    </Wrapper>
  );
}
