import * as React from 'react';
import styled from 'styled-components';

import { Tool, Color } from './common';
import { RenderingPlane } from './rendering';
import { Scene, Size } from './scene';
import { Camera } from './rendering';
import { Positioning } from './positioning';
import { Content } from './content';
import { ImageLoader } from './util';

// Operations exposed by Media Editor
export interface MediaEditorOperations {
  export(): Promise<string>; // export the image in base64
}

export interface MediaEditorProps {
  imageUrl: string;
  width: number;
  height: number;
  tool: Tool;
  shapeColor: Color;
  lineThickness: number;
  onLoadSucceeded: (operations: MediaEditorOperations) => void;
  onLoadFailed: (error?: Error) => void;
}

interface MediaEditorState {
  scene?: Scene;
  camera: Camera;
}

const Container = styled.div`
  overflow: hidden;
`;

export class MediaEditor extends React.Component<
  MediaEditorProps,
  MediaEditorState
> {
  private readonly positioning: Positioning;
  private readonly content: Content;

  constructor(props: MediaEditorProps) {
    super(props);

    const { width, height } = props;
    this.positioning = new Positioning({ width, height }, () => {
      this.setState({ camera: this.positioning });
    });
    this.content = new Content(() => {
      this.setState({ scene: this.content });
    });

    this.state = {
      camera: this.positioning,
    };
  }

  render() {
    const { width, height, imageUrl } = this.props;
    const { scene, camera } = this.state;

    return (
      <Container style={{ width, height }}>
        {scene ? (
          <RenderingPlane scene={scene} camera={camera} />
        ) : (
          <ImageLoader
            url={imageUrl}
            onLoaded={this.onImageLoadSucceeded.bind(this)}
            onFailed={this.onImageLoadFailed.bind(this)}
          />
        )}
      </Container>
    );
  }

  // Image loading

  private onImageLoadSucceeded(size: Size) {
    this.content.backImageLoaded(this.props.imageUrl, size);
    this.positioning.backImageLoaded(size);
    this.props.onLoadSucceeded({
      export: this.exportImage.bind(this),
    });
  }

  private onImageLoadFailed(error?: Error) {
    this.props.onLoadFailed(error);
  }

  // Media editor operations

  private exportImage() {}
}
