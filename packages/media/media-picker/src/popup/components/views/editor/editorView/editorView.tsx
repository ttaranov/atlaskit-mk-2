import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import {
  MediaEditor,
  Tool,
  Color,
  Dimensions,
  LoadParameters,
  ShapeParameters,
} from '@atlaskit/media-editor';

import { Toolbar, tools } from './toolbar/toolbar';
import { couldNotLoadEditor, couldNotSaveImage } from '../phrases';
import { EditorContainer } from './styles';
import { State } from '../../../../domain';

const DEFAULT_WIDTH = 845;
const DEFAULT_HEIGHT = 530;
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
  private loadParameters?: LoadParameters;
  private rootDiv?: HTMLDivElement;

  constructor(props: EditorViewProps) {
    super(props);

    this.state = {
      dimensions: { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
      color: { red: 0xbf, green: 0x26, blue: 0x00 },
      lineWidth: 10,
      tool: 'arrow',
    };
  }

  componentDidMount() {
    if (!this.rootDiv) {
      return;
    }
    const rect = this.rootDiv.getBoundingClientRect();
    const dimensions = {
      width: rect.width || DEFAULT_WIDTH,
      height: rect.height || DEFAULT_HEIGHT,
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
    const onError = () => this.onError();
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

  private onLoad = (_: string, loadParameters: LoadParameters): void => {
    this.loadParameters = loadParameters;
  };

  private onError = (): void => {
    this.props.onError(couldNotLoadEditor);
  };

  private onSave = (): void => {
    if (!this.loadParameters) {
      return;
    }
    const { imageGetter } = this.loadParameters;
    const image = imageGetter();

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

export default connect<EditorViewStateProps, {}, EditorViewOwnProps>(
  ({ editorData }: State) => ({
    imageUrl: editorData ? editorData.imageUrl || '' : '',
  }),
)(EditorView);
