import * as React from 'react';
import { Component } from 'react';
import {
  MediaEditor,
  Tool,
  Color,
  Dimensions,
  LoadParameters,
  ShapeParameters,
} from '../..';

import { Toolbar, tools } from './toolbar/toolbar';
import { couldNotLoadEditor, couldNotSaveImage } from './phrases';
import { EditorContainer } from './styles';

const DEFAULT_WIDTH = 845;
const DEFAULT_HEIGHT = 530;
export const TOOLBAR_HEIGHT = 64;
const TRANSPARENT_COLOR = { red: 0, green: 0, blue: 0, alpha: 0 };

// Properties' names in the local storage
const propertyColor = 'media-editor-color';
const propertyTool = 'media-editor-tool';
const propertyLineWidth = 'media-editor-line-width';

export interface EditorViewStateProps {
  readonly imageUrl: string;
}

export interface EditorViewOwnProps {
  readonly onSave: (image: string) => void;
  readonly onCancel: () => void;
  readonly onError: (message: string) => void;
}

export type EditorViewProps = EditorViewStateProps & EditorViewOwnProps;

export interface EditorViewState {
  readonly dimensions: Dimensions;
  readonly color: Color;
  readonly lineWidth: number;
  readonly tool: Tool;
}

export class EditorView extends Component<EditorViewProps, EditorViewState> {
  private loadParameters: LoadParameters;
  private rootDiv: HTMLDivElement;

  constructor(props: EditorViewProps) {
    super(props);

    this.state = {
      dimensions: {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT - TOOLBAR_HEIGHT,
      },
      color: { red: 0xbf, green: 0x26, blue: 0x00 },
      lineWidth: 8,
      tool: 'arrow',
    };
  }

  componentDidMount() {
    const rect = this.rootDiv.getBoundingClientRect();
    const dimensions = {
      width: rect.width || DEFAULT_WIDTH,
      height: (rect.height || DEFAULT_HEIGHT) - TOOLBAR_HEIGHT,
    };

    this.setState({ dimensions });
    this.loadProperties();
  }

  componentWillUnmount() {
    this.saveProperties();
  }

  render() {
    const refHandler = (div: HTMLDivElement) => {
      this.rootDiv = div;
    };

    return (
      <EditorContainer innerRef={refHandler}>
        {this.renderEditor()}
        {this.renderToolbar()}
      </EditorContainer>
    );
  }

  renderEditor(): JSX.Element {
    const onError = (url: string, error: Error) => this.onError(error);
    const onShapeParametersChanged = ({
      color,
      lineWidth,
    }: ShapeParameters) => {
      this.setState({ color, lineWidth });
    };

    const { imageUrl } = this.props;
    const { dimensions, color, lineWidth, tool } = this.state;

    return (
      <MediaEditor
        imageUrl={imageUrl}
        dimensions={dimensions}
        backgroundColor={TRANSPARENT_COLOR}
        shapeParameters={{ color, lineWidth, addShadow: true }}
        tool={tool}
        onLoad={this.onLoad}
        onError={onError}
        onShapeParametersChanged={onShapeParametersChanged}
      />
    );
  }

  renderToolbar(): JSX.Element {
    const { tool, color, lineWidth } = this.state;
    const onToolChanged = (tool: Tool) => this.setState({ tool });
    const onColorChanged = (color: Color) => this.setState({ color });
    const onLineWidthChanged = (lineWidth: number) =>
      this.setState({ lineWidth });
    const onCancel = () => this.props.onCancel();

    return (
      <Toolbar
        tool={tool}
        color={color}
        lineWidth={lineWidth}
        onToolChanged={onToolChanged}
        onColorChanged={onColorChanged}
        onLineWidthChanged={onLineWidthChanged}
        onSave={this.onSave}
        onCancel={onCancel}
      />
    );
  }

  private onLoad = (url: string, loadParameters: LoadParameters): void => {
    this.loadParameters = loadParameters;
  };

  private onError = (error: Error): void => {
    this.props.onError(couldNotLoadEditor);
  };

  private onSave = (): void => {
    const { imageGetter } = this.loadParameters;
    const image = imageGetter();
    this.saveProperties();

    if (image.isExported && image.content) {
      this.props.onSave(image.content);
    } else {
      this.props.onError(couldNotSaveImage);
    }
  };

  // Using local storage to save and load shape properties

  private saveProperties(): void {
    const { tool, color, lineWidth } = this.state;

    try {
      localStorage.setItem(propertyColor, JSON.stringify(color));
      localStorage.setItem(propertyTool, tool);
      localStorage.setItem(propertyLineWidth, lineWidth.toString());
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.warn(
        `Failed to save properties for MediaEditor: ${color} ${tool} ${lineWidth}`,
      );
    }
  }

  private loadProperties(): void {
    const color = localStorage.getItem(propertyColor);
    if (color) {
      try {
        this.setState({
          color: JSON.parse(color),
        });
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.warn(
          `Failed to parse color property for MediaEditor: ${color}`,
        );
      }
    }

    const tool = localStorage.getItem(propertyTool);
    if (tool && isTool(tool)) {
      this.setState({
        tool,
      });
    }

    const lineWidth = localStorage.getItem(propertyLineWidth);
    if (lineWidth) {
      this.setState({
        lineWidth: parseInt(lineWidth, 10),
      });
    }
  }
}

function isTool(value: string): value is Tool {
  return tools.some(tool => tool === value);
}
