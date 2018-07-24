import * as React from 'react';
import { Wrapper } from './styled';

export interface FrameViewProps {
  isSelected?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

export class Frame extends React.Component<FrameViewProps> {
  handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { onClick } = this.props;
    if (onClick) {
      event.preventDefault();
      event.stopPropagation();
      onClick();
    }
  };

  handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }
    const { onClick } = this.props;
    if (onClick) {
      event.preventDefault();
      event.stopPropagation();
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
