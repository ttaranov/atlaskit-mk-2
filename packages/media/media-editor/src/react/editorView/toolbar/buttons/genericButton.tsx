import * as React from 'react';
import { Component, MouseEvent } from 'react';

import { ButtonNormal, ButtonClicked, ButtonActive } from './styles';

export interface GenericButtonProps {
  readonly isActive?: boolean;
  readonly onClick: () => void;
}

export interface GenericButtonState {
  readonly isClicked: boolean;
}

export class GenericButton extends Component<
  GenericButtonProps,
  GenericButtonState
> {
  constructor(props: GenericButtonProps) {
    super(props);
    this.state = { isClicked: false };
  }

  render() {
    const { isActive } = this.props;
    const { isClicked } = this.state;
    const Container = this.getContainerClass(isClicked, isActive); // tslint:disable-line:variable-name

    return (
      <Container
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseLeave={this.onMouseLeave}
      >
        {this.props.children}
      </Container>
    );
  }

  private getContainerClass = (isClicked: boolean, isActive?: boolean) => {
    if (isClicked) {
      return ButtonClicked;
    } else if (isActive) {
      return ButtonActive;
    } else {
      return ButtonNormal;
    }
  };

  private onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button === 0) {
      this.setState({ isClicked: true });
    }
  };

  private onMouseUp = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button === 0) {
      this.setState({ isClicked: false });
      this.props.onClick();
    }
  };

  private onMouseLeave = () => {
    if (this.state.isClicked) {
      this.setState({ isClicked: false });
    }
  };
}
