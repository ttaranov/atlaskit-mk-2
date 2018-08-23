import * as React from 'react';
import { Component } from 'react';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { GenericButton } from './genericButton';
import { toolIcons } from './toolButton';
import { Tool } from '../../../../common';
import { shapeTools } from '../popups/shapePopup';
import { DropdownIconWrapper } from './styles';

export interface ShapeButtonProps {
  readonly activeShape: Tool;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

export class ShapeButton extends Component<ShapeButtonProps> {
  render() {
    const { isActive, onClick, activeShape } = this.props;
    const isShapeTool = shapeTools.indexOf(activeShape) > -1;
    const Icon = toolIcons[isShapeTool ? activeShape : shapeTools[0]];
    return (
      <GenericButton isActive={isActive} onClick={onClick}>
        <DropdownIconWrapper>
          <Icon label={activeShape} size="medium" />
        </DropdownIconWrapper>
        <ChevronDownIcon label="chevron-icon" />
      </GenericButton>
    );
  }
}
