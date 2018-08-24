import * as React from 'react';
import { Component } from 'react';
import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { DropdownRightIconWrapper, DropdownLeftIconWrapper } from './styles';
import { LineWidthIcon } from '../popups/lineWidthIcon';

export interface LineWidthButtonProps {
  readonly lineWidth: number;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

export class LineWidthButton extends Component<LineWidthButtonProps> {
  render() {
    const { isActive, lineWidth, onClick } = this.props;

    const iconBefore = (
      <DropdownLeftIconWrapper>
        <LineWidthIcon
          currentLineWidth={lineWidth}
          lineWidth={lineWidth}
          onLineWidthClick={() => {}}
        />
      </DropdownLeftIconWrapper>
    );
    const iconAfter = (
      <DropdownRightIconWrapper>
        <ChevronDownIcon label="chevron-icon" />
      </DropdownRightIconWrapper>
    );
    return (
      <Button
        iconBefore={iconBefore}
        iconAfter={iconAfter}
        appearance="subtle"
        onClick={onClick}
        isSelected={isActive}
      />
    );
  }
}
