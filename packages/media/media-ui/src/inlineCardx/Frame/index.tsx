import * as React from 'react';
import { Wrapper } from './styled';

export interface FrameViewProps {
  isSelected?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

export class Frame extends React.Component<FrameViewProps> {
  handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  };

  handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const { onClick } = this.props;
    if (onClick) {
      onClick();
    }
  };

  render() {
    const { isSelected, children, onClick } = this.props;
    const isInteractive = Boolean(onClick);
    return (
      <Wrapper
        isSelected={isSelected}
        isInteractive={isInteractive}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : undefined}
        onClick={this.handleClick}
        onKeyPress={this.handleKeyPress}
      >
        {children}
      </Wrapper>
    );
  }
}
