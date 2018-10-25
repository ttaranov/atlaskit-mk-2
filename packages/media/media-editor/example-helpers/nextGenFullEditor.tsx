import * as React from 'react';

import { NextGenToolbar } from './nextGenToolbar';
import {
  Tool,
  Color,
  MediaEditor,
  MediaEditorOperations,
} from '../src/next-gen';

export interface NextGenFullEditorProps {
  imageUrl: string;
}

interface NextGenFullEditorState {
  editorOperations?: MediaEditorOperations;
  tool: Tool;
  lineThickness: number;
  color: Color;
}

export class NextGenFullEditor extends React.Component<
  NextGenFullEditorProps,
  NextGenFullEditorState
> {
  constructor(props: NextGenFullEditorProps) {
    super(props);

    this.state = {
      tool: 'line',
      lineThickness: 8,
      color: { red: 255, green: 0, blue: 0 },
    };
  }

  render() {
    const { imageUrl } = this.props;
    const { tool, lineThickness, color } = this.state;

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: 'rgb(224, 235, 235)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgb(224, 224, 235)',
          }}
        >
          <MediaEditor
            imageUrl={imageUrl}
            width={600}
            height={400}
            tool={tool}
            shapeColor={color}
            lineThickness={lineThickness}
            onLoadSucceeded={this.onLoadSucceeded.bind(this)}
            onLoadFailed={this.onLoadFailed.bind(this)}
          />
        </div>

        <NextGenToolbar
          tool={tool}
          lineThickness={lineThickness}
          color={color}
          canDelete={true}
          onToolChanged={this.onToolbarToolChanged.bind(this)}
          onLineThicknessChanged={this.onToolbarLineThicknessChanged.bind(this)}
          onColorChanged={this.onToolbarColorChanged.bind(this)}
          onDelete={this.onToolbarDelete.bind(this)}
          onExport={this.onToolbarExport.bind(this)}
        />
      </div>
    );
  }

  // Events from editor

  private onLoadSucceeded(editorOperations: MediaEditorOperations) {
    console.log('Editor loaded');
    this.setState({ editorOperations });
  }

  private onLoadFailed(error?: Error) {
    console.error('Could not load the editor. Reported error:', error);
  }

  // Events from toolbar

  private onToolbarToolChanged(tool: Tool) {
    this.setState({ tool });
  }

  private onToolbarLineThicknessChanged(lineThickness: number) {
    this.setState({ lineThickness });
  }

  private onToolbarColorChanged(color: Color) {
    this.setState({ color });
  }

  private onToolbarDelete() {
    console.log('Delete pressed');
  }

  private onToolbarExport() {
    const { editorOperations } = this.state;
    if (!editorOperations) {
      console.error('Could not export because the editor was not loaded');
      return;
    }

    editorOperations
      .export()
      .then(content => {
        NextGenFullEditor.saveAs(content);
      })
      .catch(error => {
        console.error('Could not get the image', error);
      });
  }

  private static saveAs(base64Image: string) {
    const data = atob(base64Image.substring('data:image/png;base64,'.length));
    const asArray = new Uint8Array(data.length);

    for (var i = 0, len = data.length; i < len; ++i) {
      asArray[i] = data.charCodeAt(i);
    }

    const blob = new Blob([asArray.buffer], { type: 'image/png' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'image.png');

    const clickEvent = document.createEvent('MouseEvent');
    clickEvent.initMouseEvent(
      'click',
      true,
      true,
      window,
      1,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null,
    );
    link.dispatchEvent(clickEvent);
  }
}
