import * as React from 'react';
import styled from 'styled-components';

import Button from '@atlaskit/button';
import BrushIcon from '@atlaskit/icon/glyph/media-services/brush';
import LineIcon from '@atlaskit/icon/glyph/media-services/line';
import ArrowIcon from '@atlaskit/icon/glyph/media-services/arrow';
import OvalIcon from '@atlaskit/icon/glyph/media-services/oval';
import RectangleIcon from '@atlaskit/icon/glyph/media-services/rectangle';
import BlurIcon from '@atlaskit/icon/glyph/media-services/blur';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import QuestionIcon from '@atlaskit/icon/glyph/question-circle';
import MoveIcon from '@atlaskit/icon/glyph/bitbucket/source';

import { Tool, Color } from '../src/next-gen';

const Container = styled.div`
  position: absolute;
  background-color: white;
  white-space: nowrap;
`;

const Holder = styled.div`
  position: absolute;
  background-color: rgb(102, 102, 153);
  height: 100%;
  width: 8px;
  cursor: move;
`;

export interface NextGenToolbarProps {
  tool: Tool; // selected tool
  lineThickness: number;
  color: Color;
  canDelete: boolean; // is 'delete' button available
  onToolChanged: (tool: Tool) => void;
  onLineThicknessChanged: (thickness: number) => void;
  onColorChanged: (color: Color) => void;
  onDelete: () => void;
  onExport: () => void;
}

interface ToolbarState {
  top: number;
  left: number;
}

export class NextGenToolbar extends React.Component<
  NextGenToolbarProps,
  ToolbarState
> {
  constructor(props: NextGenToolbarProps) {
    super(props);

    this.state = {
      left: 16,
      top: 16,
    };
  }

  render() {
    const { top, left } = this.state;
    const { tool, color, canDelete, lineThickness } = this.props;

    return (
      <Container style={{ top, left }}>
        <Holder onMouseDown={this.onMouseDown.bind(this)} />
        <div style={{ marginLeft: 12 }}>
          {this.createToolbarButton('arrow', tool)}
          {this.createToolbarButton('line', tool)}
          {this.createToolbarButton('brush', tool)}
          {this.createToolbarButton('rectangle', tool)}
          {this.createToolbarButton('blur', tool)}
          {this.createToolbarButton('oval', tool)}
          {this.createToolbarButton('move', tool)}
          <input
            type="range"
            min="4"
            max="12"
            step="2"
            value={lineThickness}
            onChange={event => {
              const target = event.target as HTMLInputElement;
              const lineThickness = parseInt(target.value);
              if (lineThickness === this.props.lineThickness) {
                return;
              }

              this.props.onLineThicknessChanged(lineThickness);
            }}
            style={{
              width: 60,
              verticalAlign: 'middle',
            }}
          />
          <input
            type="color"
            value={NextGenToolbar.colorToInputValue(color)}
            onChange={event => {
              const target = event.target as HTMLInputElement;
              const color = NextGenToolbar.inputValueToColor(target.value);
              const { red, green, blue } = color;
              const {
                red: oldRed,
                green: oldGreen,
                blue: oldBlue,
              } = this.props.color;
              if (red === oldRed && green === oldGreen && blue === oldBlue) {
                return;
              }

              this.props.onColorChanged(color);
            }}
            style={{
              width: 30,
              verticalAlign: 'middle',
            }}
          />
          {canDelete ? (
            <Button appearance="subtle" onClick={() => this.props.onDelete()}>
              <TrashIcon label="trash" size="small" />
            </Button>
          ) : null}
          <Button appearance="primary" onClick={() => this.props.onExport()}>
            Export
          </Button>
        </div>
      </Container>
    );
  }

  private createToolbarButton(targetTool: Tool, currentTool: Tool) {
    return (
      <Button
        key={targetTool}
        appearance="subtle"
        isSelected={targetTool === currentTool}
        onClick={() => this.props.onToolChanged(targetTool)}
      >
        {this.createIcon(targetTool)}
      </Button>
    );
  }

  private createIcon(tool: Tool) {
    switch (tool) {
      case 'line':
        return <LineIcon label="line" size="small" />;

      case 'brush':
        return <BrushIcon label="brush" size="small" />;

      case 'arrow':
        return <ArrowIcon label="arrow" size="small" />;

      case 'blur':
        return <BlurIcon label="blur" size="small" />;

      case 'rectangle':
        return <RectangleIcon label="rectangle" size="small" />;

      case 'oval':
        return <OvalIcon label="oval" size="small" />;

      case 'move':
        return <MoveIcon label="move" size="small" />;

      default:
        return <QuestionIcon label="oval" size="small" />;
    }
  }

  private static colorToInputValue(color: Color) {
    const toHex = (channel: number) => {
      return channel < 16 ? `0${channel.toString(16)}` : channel.toString(16);
    };

    return `#${toHex(color.red)}${toHex(color.green)}${toHex(color.blue)}`;
  }

  private static inputValueToColor(value: string) {
    return {
      red: parseInt(value.substr(1, 2), 16),
      green: parseInt(value.substr(3, 2), 16),
      blue: parseInt(value.substr(5, 2), 16),
    };
  }

  // Toolbar moving

  private x: number = 0;
  private y: number = 0;
  private anchorLeft: number = 0;
  private anchorTop: number = 0;

  private onMouseDown(event: MouseEvent) {
    event.preventDefault();

    const { left, top } = this.state;
    this.x = event.clientX;
    this.y = event.clientY;
    this.anchorLeft = left;
    this.anchorTop = top;

    document.onmousemove = event => {
      const x = event.clientX - this.x;
      const y = event.clientY - this.y;

      this.setState({
        left: this.anchorLeft + x,
        top: this.anchorTop + y,
      });
    };

    document.onmouseup = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };
  }
}
