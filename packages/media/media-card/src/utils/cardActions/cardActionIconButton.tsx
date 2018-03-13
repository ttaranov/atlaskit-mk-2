import * as React from 'react';
import { Component, ReactNode, MouseEvent } from 'react';

import { CardActionButton } from './styled';

const NOOP = () => {};

export type CardActionIconButtonProps = {
  readonly icon: ReactNode;

  readonly triggerColor?: string;
  readonly onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export class CardActionIconButton extends Component<CardActionIconButtonProps> {
  render(): JSX.Element {
    const { icon, triggerColor, onClick = NOOP } = this.props;
    return (
      <CardActionButton onClick={onClick} style={{ color: triggerColor }}>
        {icon}
      </CardActionButton>
    );
  }
}
