import * as React from 'react';

import { Toolbar } from '../src/react/editorView/toolbar/toolbar';
import { Color, Tool } from '../index';

interface State {
  readonly color: Color;
  readonly tool: Tool;
  readonly lineWidth: number;
}

class ToolbarExample extends React.Component<{}, State> {
  state: State = {
    color: { red: 0xbf, green: 0x26, blue: 0x00 },
    lineWidth: 10,
    tool: 'arrow',
  };

  onSave = () => {
    console.log('Save!');
  };

  onCancel = () => {
    console.log('Cancel!');
  };

  onToolChanged = (tool: Tool) => this.setState({ tool });
  onColorChanged = (color: Color) => this.setState({ color });
  onLineWidthChanged = (lineWidth: number) => this.setState({ lineWidth });

  render() {
    const { lineWidth, color, tool } = this.state;

    return (
      <Toolbar
        color={color}
        tool={tool}
        lineWidth={lineWidth}
        onSave={this.onSave}
        onCancel={this.onCancel}
        onToolChanged={this.onToolChanged}
        onColorChanged={this.onColorChanged}
        onLineWidthChanged={this.onLineWidthChanged}
      />
    );
  }
}
export default () => <ToolbarExample />;
