import * as React from 'react';
import { Component } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { Tool, Color } from '../../../..';

import { LineWidthButton } from './buttons/lineWidthButton';
import { ColorButton } from './buttons/colorButton';
import { ToolButton } from './buttons/toolButton';
import { LineWidthPopup } from './popups/lineWidthPopup';
import { ColorPopup } from './popups/colorPopup';
import { ToolbarContainer, CenterButtons, VerticalLine } from './styles';
import { buttonSave, buttonCancel } from '../../../react/editorView/phrases';
import { ShapePopup, shapeTools } from './popups/shapePopup';
import { ShapeButton } from './buttons/shapeButton';

export type PopupState = 'none' | 'color' | 'lineWidth' | 'shape';

export const tools: Tool[] = [
  'arrow',
  'rectangle',
  'oval',
  'line',
  'text',
  'blur',
  'brush',
];

export interface ToolbarProps {
  readonly color: Color;
  readonly tool: Tool;
  readonly lineWidth: number;
  readonly onSave: () => void;
  readonly onCancel: () => void;
  readonly onToolChanged: (tool: Tool) => void;
  readonly onColorChanged: (color: Color) => void;
  readonly onLineWidthChanged: (lineWidth: number) => void;
}

export interface ToolbarState {
  readonly popup: PopupState;
}

export class Toolbar extends Component<ToolbarProps, ToolbarState> {
  constructor(props: ToolbarProps) {
    super(props);
    this.state = { popup: 'none' };
  }

  render() {
    const {
      color,
      tool,
      lineWidth,
      onColorChanged,
      onLineWidthChanged,
    } = this.props;

    const onColorButtonClick = () => this.showOrHidePopup('color');
    const onLineWidthButtonClick = () => this.showOrHidePopup('lineWidth');
    const onShapeButtonClick = () => this.showOrHidePopup('shape');

    const showColorPopup = this.state.popup === 'color';
    const showLineWidthPopup = this.state.popup === 'lineWidth';
    const showShapePopup = this.state.popup === 'shape';

    const onPickColor = (color: Color) => {
      onColorChanged(color);
      this.setState({ popup: 'none' });
    };

    const onLineWidthClick = (lineWidth: number) => {
      onLineWidthChanged(lineWidth);
      this.setState({ popup: 'none' });
    };

    const isShapeTool = shapeTools.indexOf(tool) > -1;

    return (
      <ToolbarContainer>
        <CenterButtons>
          {this.renderSimpleTool('arrow')}
          {this.renderSimpleTool('text')}

          <ShapePopup
            isOpen={showShapePopup}
            shape={tool}
            onPickShape={this.onToolClick}
          >
            <div>
              <ShapeButton
                onClick={onShapeButtonClick}
                isActive={isShapeTool}
                activeShape={tool}
              />
            </div>
          </ShapePopup>

          {this.renderSimpleTool('brush')}
          {this.renderSimpleTool('blur')}

          <VerticalLine />
          <LineWidthPopup
            onLineWidthClick={onLineWidthClick}
            lineWidth={lineWidth}
            isOpen={showLineWidthPopup}
          >
            <div>
              <LineWidthButton
                lineWidth={lineWidth}
                isActive={showLineWidthPopup}
                onClick={onLineWidthButtonClick}
              />
            </div>
          </LineWidthPopup>

          <ColorPopup
            onPickColor={onPickColor}
            color={color}
            isOpen={showColorPopup}
          >
            <div>
              <ColorButton
                color={color}
                isActive={showColorPopup}
                onClick={onColorButtonClick}
              />
            </div>
          </ColorPopup>

          <VerticalLine />

          <ButtonGroup>
            <Button
              appearance="primary"
              theme="dark"
              onClick={this.props.onSave}
            >
              {buttonSave}
            </Button>
            <Button
              appearance="subtle"
              onClick={this.props.onCancel}
              theme="dark"
            >
              {buttonCancel}
            </Button>
          </ButtonGroup>
        </CenterButtons>
      </ToolbarContainer>
    );
  }

  private onToolClick = (tool: Tool) => {
    this.setState({ popup: 'none' });
    this.props.onToolChanged(tool);
  };

  private renderSimpleTool(tool: Tool) {
    const { tool: activeTool } = this.props;

    return (
      <ToolButton
        key={tool}
        tool={tool}
        activeTool={activeTool}
        onToolClick={this.onToolClick}
      />
    );
  }

  private showOrHidePopup(target: PopupState): void {
    if (this.state.popup === target) {
      this.setState({ popup: 'none' });
    } else {
      this.setState({ popup: target });
    }
  }
}
