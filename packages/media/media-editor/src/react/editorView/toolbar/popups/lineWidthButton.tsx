import * as React from 'react';
import { Component } from 'react';
import {
  Container,
  HoverArea,
  MainArea,
  BackAreaNormal,
  BackAreaSelected,
  FrontAreaNormal,
  FrontAreaSelected,
} from './lineWidthButtonStyles';

export interface LineWidthButtonProps {
  readonly lineWidth: number;
  readonly currentLineWidth: number;
  readonly onLineWidthClick: (lineWidth: number) => void;
}

export class LineWidthButton extends Component<LineWidthButtonProps> {
  render() {
    const { lineWidth, currentLineWidth, onLineWidthClick } = this.props;
    const onClick = () => onLineWidthClick(lineWidth);

    const isSelected = lineWidth === currentLineWidth;

    const BackArea = isSelected ? BackAreaSelected : BackAreaNormal; // tslint:disable-line:variable-name
    const FrontArea = isSelected ? FrontAreaSelected : FrontAreaNormal; // tslint:disable-line:variable-name

    const style = {
      width: `${lineWidth * 2}px`,
      height: `${lineWidth * 2}px`,
      borderRadius: `${lineWidth}px`,
    };

    return (
      <Container onClick={onClick}>
        <HoverArea>
          <MainArea>
            <BackArea>
              <FrontArea style={style} />
            </BackArea>
          </MainArea>
        </HoverArea>
      </Container>
    );
  }
}
