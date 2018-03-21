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
  canClose,
  onClose,
  canOptOut,
  onOptOut,
}: {
  optOutLabel?: Node,
  canClose: boolean,
  onClose?: () => void,
  canOptOut: boolean,
  onOptOut?: () => void,
}) {
  const buttons = [];
  if (canOptOut) {
    buttons.push(
      <Button key="opt-out" onClick={onOptOut} appearance="subtle">
        {optOutLabel}
      </Button>,
    );
  }
  if (canClose) {
    buttons.push(
      <Button
        key="close"
        appearance="subtle"
        onClick={onClose}
        iconBefore={<CloseIcon label="Close" size="small" />}
      />,
    );
  }
  return <ButtonGroup>{buttons}</ButtonGroup>;
}

export function Header({
  title,
  canClose,
  onClose,
  canOptOut,
  onOptOut,
  optOutLabel,
}: {
  title: Node,
  canClose: boolean,
  onClose?: () => void,
  canOptOut: boolean,
  onOptOut?: () => void,
  optOutLabel?: Node,
}) {
  return (
    <StyledHeader>
      <Title>{title}</Title>
      <HeaderButtons
        canClose={canClose}
        canOptOut={canOptOut}
        onClose={onClose}
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
