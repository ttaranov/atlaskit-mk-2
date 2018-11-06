import * as React from 'react';
import { Component } from 'react';
import { Tool, Color } from '@atlaskit/media-editor';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { LineWidthButton } from './buttons/lineWidthButton';
import { ColorButton } from './buttons/colorButton';
import { ToolButton } from './buttons/toolButton';
import { LineWidthPopup } from './popups/lineWidthPopup';
import { ColorPopup } from './popups/colorPopup';
import {
  ToolbarContainer,
  CenterButtons,
  RightButtons,
  RightButton,
} from './styles';
import { messages } from '@atlaskit/media-ui';

export type PopupState = 'none' | 'color' | 'lineWidth';

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

export class Toolbar extends Component<
  ToolbarProps & InjectedIntlProps,
  ToolbarState
> {
  state: ToolbarState = { popup: 'none' };

  render() {
    const {
      color,
      onSave,
      onCancel,
      intl: { formatMessage },
    } = this.props;

    const onColorButtonClick = () => this.showOrHidePopup('color');
    const onLineWidthButtonClick = () => this.showOrHidePopup('lineWidth');

    const isColorButtonActive = this.state.popup === 'color';
    const isLineWidthButtonActive = this.state.popup === 'lineWidth';

    return (
      <ToolbarContainer>
        <CenterButtons>
          {this.renderToolButtons()}
          <LineWidthButton
            isActive={isLineWidthButtonActive}
            onClick={onLineWidthButtonClick}
          />
          <ColorButton
            color={color}
            isActive={isColorButtonActive}
            onClick={onColorButtonClick}
          />
        </CenterButtons>

        <RightButtons>
          <RightButton appearance="primary" theme="dark" onClick={onSave}>
            {formatMessage(messages.save)}
          </RightButton>
          <RightButton appearance="subtle" onClick={onCancel} theme="dark">
            {formatMessage(messages.cancel)}
          </RightButton>
        </RightButtons>

        {this.renderPopup()}
      </ToolbarContainer>
    );
  }

  private renderToolButtons(): JSX.Element[] {
    const { tool: activeTool, onToolChanged } = this.props;
    const onToolClick = (tool: Tool) => onToolChanged(tool);

    return tools.map(tool => (
      <ToolButton
        key={tool}
        tool={tool}
        activeTool={activeTool}
        onToolClick={onToolClick}
      />
    ));
  }

  private showOrHidePopup(target: PopupState): void {
    if (this.state.popup === target) {
      this.setState({ popup: 'none' });
    } else {
      this.setState({ popup: target });
    }
  }

  private renderPopup(): JSX.Element | null {
    const { color, lineWidth, onColorChanged, onLineWidthChanged } = this.props;
    const { popup } = this.state;

    if (popup === 'color') {
      const onPickColor = (color: Color) => {
        onColorChanged(color);
        this.setState({ popup: 'none' });
      };

      return <ColorPopup onPickColor={onPickColor} color={color} />;
    }

    if (popup === 'lineWidth') {
      const onLineWidthClick = (lineWidth: number) => {
        onLineWidthChanged(lineWidth);
        this.setState({ popup: 'none' });
      };

      return (
        <LineWidthPopup
          onLineWidthClick={onLineWidthClick}
          lineWidth={lineWidth}
        />
      );
    }

    return null;
  }
}

export default injectIntl(Toolbar);
