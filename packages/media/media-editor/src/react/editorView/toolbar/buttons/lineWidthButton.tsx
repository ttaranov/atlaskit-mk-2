import * as React from 'react';
import { Component } from 'react';
import { GenericButton } from './genericButton';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { DropdownIconWrapper } from './styles';
import { LineWidthIcon } from '../popups/lineWidthIcon';

export interface LineWidthButtonProps {
  readonly lineWidth: number;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

export class LineWidthButton extends Component<LineWidthButtonProps> {
  render() {
    const { isActive, lineWidth, onClick } = this.props;

    return (
      <GenericButton isActive={isActive} onClick={onClick}>
        <DropdownIconWrapper>
          <LineWidthIcon
            currentLineWidth={lineWidth}
            lineWidth={lineWidth}
            onLineWidthClick={() => {}}
          />
        </DropdownIconWrapper>
        <ChevronDownIcon label="chevron-icon" />
      </GenericButton>
    );
  }
}
