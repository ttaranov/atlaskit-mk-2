import * as React from 'react';
import { Component } from 'react';
import { LineWidthPopupContainer } from './popupStyles';
import { LineWidthButton } from './lineWidthButton';

export interface LineWidthPopupProps {
  readonly lineWidth: number;
  readonly onLineWidthClick: (lineWidth: number) => void;
}

export class LineWidthPopup extends Component<LineWidthPopupProps> {
  render(): JSX.Element {
    return <LineWidthPopupContainer>{this.buttons()}</LineWidthPopupContainer>;
  }

  private buttons(): JSX.Element[] {
    const { onLineWidthClick, lineWidth: currentLineWidth } = this.props;
    const lineWidths = [4, 6, 8, 10, 12];

    return lineWidths.map(lineWidth => (
      <LineWidthButton
        key={`${lineWidth}`}
        lineWidth={lineWidth}
        currentLineWidth={currentLineWidth}
        onLineWidthClick={onLineWidthClick}
      />
    ));
  }
}
