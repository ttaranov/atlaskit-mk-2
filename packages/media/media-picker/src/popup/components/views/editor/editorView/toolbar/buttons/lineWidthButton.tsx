import * as React from 'react';
import { Component } from 'react';
import MediaServicesLineThicknessIcon from '@atlaskit/icon/glyph/media-services/line-thickness';
import { GenericButton } from './genericButton';
import { OptionsIcon } from './optionsIcon';

export interface LineWidthButtonProps {
  readonly isActive: boolean;
  readonly onClick: () => void;
}

export class LineWidthButton extends Component<LineWidthButtonProps> {
  render() {
    const { isActive, onClick } = this.props;

    return (
      <GenericButton isActive={isActive} onClick={onClick}>
        <MediaServicesLineThicknessIcon label="line width" />
        <OptionsIcon isActive={isActive} />
      </GenericButton>
    );
  }
}
