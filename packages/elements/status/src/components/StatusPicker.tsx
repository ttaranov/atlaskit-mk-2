import * as React from 'react';
import { PureComponent } from 'react';
import ColorPalette from './internal/color-palette';

export interface Props {
  selectedColor: string;
  onColorClick: (value: string) => void;
}

export class StatusPicker extends PureComponent<Props, any> {
  render() {
    const { selectedColor, onColorClick } = this.props;

    return (
      <ColorPalette onClick={onColorClick} selectedColor={selectedColor} />
    );
  }
}
