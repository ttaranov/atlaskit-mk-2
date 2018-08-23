import * as React from 'react';
import { Component } from 'react';
import MediaServicesLineThicknessIcon from '@atlaskit/icon/glyph/media-services/line-thickness';
import { GenericButton } from './genericButton';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { DropdownIconWrapper } from './styles';

export interface LineWidthButtonProps {
  readonly isActive: boolean;
  readonly onClick: () => void;
}

export class LineWidthButton extends Component<LineWidthButtonProps> {
  render() {
    const { isActive, onClick } = this.props;

    return (
      <GenericButton isActive={isActive} onClick={onClick}>
        <DropdownIconWrapper>
          <MediaServicesLineThicknessIcon label="line width" />
        </DropdownIconWrapper>
        <ChevronDownIcon label="chevron-icon" />
      </GenericButton>
    );
  }
}
