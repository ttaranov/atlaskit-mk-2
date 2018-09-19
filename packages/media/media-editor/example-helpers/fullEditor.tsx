/* tslint:disable:no-console */

import * as React from 'react';
import {
  Color,
  ColorWithAlpha,
  Dimensions,
  ErrorHandler,
  LoadHandler,
  MediaEditor,
  Tool,
  Toolbar,
} from '../src';
import { ShapeParametersChangedHandler } from '../src/react/mediaEditor';
import {
  ColorChangedHandler,
  LineWidthChangedHandler,
  ToolChangedHandler,
} from '../src/react/toolbar';

export interface FullEditorProps {
  imageUrl: string;
  backgroundColor: ColorWithAlpha;
  onLoad: LoadHandler;
  onError: ErrorHandler;
}

export interface FullEditorState {
  dimensions: Dimensions;
  color: Color;
  lineWidth: number;
  addShadow: boolean;
  tool: Tool;
}

const defaultDimensions = { width: 100, height: 50 };
const defaultColor = { red: 250, green: 61, blue: 17 };
const defaultShapeParameters = {
  color: defaultColor,
  lineWidth: 10,
  addShadow: true,
};
const defaultTool = 'brush';

export class FullEditor extends React.Component<
  FullEditorProps,
  FullEditorState
> {
  private readonly windowResizeListener = () => this.adjustDimensions();
  private container?: HTMLDivElement;

  constructor(props: FullEditorProps) {
    super(props);

    this.state = {
      dimensions: defaultDimensions,
      color: defaultShapeParameters.color,
      lineWidth: defaultShapeParameters.lineWidth,
      addShadow: defaultShapeParameters.addShadow,
      tool: defaultTool,
    };

    console.log(this.state);
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowResizeListener);
    this.adjustDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResizeListener);
  }

  private handleDivRef = (div: HTMLDivElement) => {
    this.container = div;
  };

  private handleShapeParametersChanged: ShapeParametersChangedHandler = shapeParameters => {
    this.setState({
      color: shapeParameters.color,
      lineWidth: shapeParameters.lineWidth,
      addShadow: shapeParameters.addShadow,
    });
  };

  private handleToolbarColorChanged: ColorChangedHandler = color => {
    this.setState({ color });
  };
  private handleToolbarLineWidthChanged: LineWidthChangedHandler = lineWidth => {
    this.setState({ lineWidth });
  };
  private handleToolbarToolChanged: ToolChangedHandler = tool => {
    this.setState({ tool });
  };

  render() {
    return (
      <div
        ref={this.handleDivRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <MediaEditor
          imageUrl={this.props.imageUrl}
          dimensions={this.state.dimensions}
          backgroundColor={this.props.backgroundColor}
          shapeParameters={{
            color: this.state.color,
            lineWidth: this.state.lineWidth,
            addShadow: this.state.addShadow,
          }}
          tool={this.state.tool}
          onLoad={this.props.onLoad}
          onError={this.props.onError}
          onShapeParametersChanged={this.handleShapeParametersChanged}
        />

        <div style={{ position: 'absolute', top: '15px', left: '15px' }}>
          <Toolbar
            color={this.state.color}
            lineWidth={this.state.lineWidth}
            tool={this.state.tool}
            onColorChanged={this.handleToolbarColorChanged}
            onLineWidthChanged={this.handleToolbarLineWidthChanged}
            onToolChanged={this.handleToolbarToolChanged}
          />
        </div>
      </div>
    );
  }

  private adjustDimensions(): void {
    if (!this.container) {
      return;
    }
    const rect = this.container.getBoundingClientRect();
    const { width, height } = rect;

    this.setState({ dimensions: { width, height } });
  }
}
