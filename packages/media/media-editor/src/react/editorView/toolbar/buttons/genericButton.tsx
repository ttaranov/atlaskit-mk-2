import * as React from 'react';
import { Component } from 'react';

import { ToolbarButton, ActiveToolbarButton } from './styles';

export interface GenericButtonProps {
  readonly isActive?: boolean;
  readonly onClick: () => void;
}

export class GenericButton extends Component<GenericButtonProps> {
  render() {
    const { isActive, onClick } = this.props;
    const Container = this.getContainerClass(isActive); // tslint:disable-line:variable-name

    return <Container onClick={onClick}>{this.props.children}</Container>;
  }

  private getContainerClass = (isActive?: boolean) => {
    if (isActive) {
      return ActiveToolbarButton;
    } else {
      return ToolbarButton;
    }
  };
}
