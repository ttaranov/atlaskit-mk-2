// @flow
import React, { Component, type Node } from 'react';
import Button from '@atlaskit/button';
import InlineDialog from '@atlaskit/inline-dialog';
import IconForType from '../IconForType';
import type { IconType, PositionType } from '../../types';
import { Root, ButtonContents, Text, Title } from './styledInlineMessage';

type Props = {
  /** The elements to be displayed by the inline dialog. */
  children?: Node,
  /** Position prop to be passed to the inline dialog. Determines where around
   the text the dialog is displayed. */
  position?: PositionType,
  /** Text to display second. */
  secondaryText?: string,
  /** Text to display first, bolded for emphasis. */
  title?: string,
  /** Set the icon to be used before the title. Options are: connectivity,
   confirmation, info, warning, and error. */
  type: IconType,
};

type State = {
  isOpen: boolean,
  isHovered: boolean,
};

export default class InlineMessage extends Component<Props, State> {
  static defaultProps = {
    type: 'connectivity',
    position: 'bottom left',
  };

  state = {
    isOpen: false,
    isHovered: false,
  };

  onMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  onMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  toggleDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { children, position, secondaryText, title, type } = this.props;
    const { isHovered, isOpen } = this.state;
    return (
      <Root
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        appearance={type}
      >
        <InlineDialog
          content={children}
          isOpen={isOpen}
          position={position}
          shouldFlip
        >
          <Button
            appearance="subtle-link"
            onClick={this.toggleDialog}
            spacing="none"
          >
            <ButtonContents isHovered={isHovered}>
              <IconForType type={type} isHovered={isHovered} isOpen={isOpen} />
              {title ? <Title isHovered={isHovered}>{title}</Title> : null}
              {secondaryText ? (
                <Text isHovered={isHovered}>{secondaryText}</Text>
              ) : null}
            </ButtonContents>
          </Button>
        </InlineDialog>
      </Root>
    );
  }
}
