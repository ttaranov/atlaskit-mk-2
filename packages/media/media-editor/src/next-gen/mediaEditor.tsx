import * as React from 'react';
import styled from 'styled-components';

import { Tool, Color } from './common';
import { RenderingPlane } from './rendering';
import { Scene, Size, Point } from './scene';
import { CreatedModel, createModel } from './scene/creating';
import { Camera } from './rendering';
import { Positioning } from './positioning';
import { Content } from './content';
import { ImageLoader, Exporter } from './util';

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
  createdModel?: CreatedModel;
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
  private container?: HTMLElement;

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
    const { scene, camera, createdModel } = this.state;

    const createdModels = createdModel ? [createdModel.model] : [];

    return (
      <Container
        style={{ width, height }}
        innerRef={ref => (this.container = ref)}
        onMouseDown={this.onMouseDown.bind(this)}
        onWheel={this.onMouseWheel.bind(this)}
      >
        {scene ? (
          <RenderingPlane
            scene={scene}
            camera={camera}
            createdModels={createdModels}
          />
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

  private exportImage(): Promise<string> {
    const { scene } = this.state;
    if (!scene) {
      return Promise.reject(new Error('No scene created yet'));
    }

    const exporter = new Exporter(scene);
    return exporter.export();
  }

  // Mouse operations

  private onMouseWheel(event: WheelEvent) {
    if (!this.container) {
      return;
    }

    event.preventDefault();
    const screenPoint = MediaEditor.getMouseCoordinates(event, this.container);
    const step = 0.15;
    const scale = this.positioning.scale + Math.sign(event.deltaY) * step;

    this.positioning.zoom(scale, screenPoint);
  }

  private initialMouseScenePosition?: Point; // in scene coordinates
  private isDragging = false;

  // For simplicity I don't check the mouse button.
  // For production-ready code we need to check the mouse button in onMouseDown and onMouseUp

  private onMouseDown(event: MouseEvent) {
    if (!this.container) {
      return;
    }

    event.preventDefault();
    const screenPoint = MediaEditor.getMouseCoordinates(event, this.container);
    const scenePoint = this.positioning.screenToScene(screenPoint);

    this.initialMouseScenePosition = scenePoint;
    this.isDragging = false;

    document.onmousemove = this.onMouseMove.bind(this);
    document.onmouseup = this.onMouseUp.bind(this);
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.initialMouseScenePosition || !this.container) {
      this.initialMouseScenePosition = undefined;
      this.isDragging = false;
      document.onmousemove = null;
      document.onmouseup = null;
      return;
    }

    event.preventDefault();

    if (!this.isDragging) {
      this.isDragging = true;
      this.handleDragStart(this.initialMouseScenePosition);
    }

    const screenPoint = MediaEditor.getMouseCoordinates(event, this.container);
    const scenePoint = this.positioning.screenToScene(screenPoint);
    this.handleDragMove(scenePoint, this.initialMouseScenePosition);
  }

  private onMouseUp(event: MouseEvent) {
    if (!this.initialMouseScenePosition || !this.container) {
      this.initialMouseScenePosition = undefined;
      this.isDragging = false;
      document.onmousemove = null;
      document.onmouseup = null;
      return;
    }

    event.preventDefault();
    const screenPoint = MediaEditor.getMouseCoordinates(event, this.container);
    const realPoint = this.positioning.screenToScene(screenPoint);

    if (this.isDragging) {
      this.handleDragEnd(realPoint, this.initialMouseScenePosition);
    } else {
      this.handleOneClick(realPoint);
    }

    this.isDragging = false;
    this.initialMouseScenePosition = undefined;
    document.onmousemove = null;
    document.onmouseup = null;
  }

  private handleDragStart(position: Point) {
    const { tool, shapeColor } = this.props;
    if (tool === 'move') {
      // Move camera
    } else {
      const createdModel = createModel(
        this.content.nextId,
        tool,
        position,
        shapeColor,
        this.sceneThickness,
      );
      if (!!createdModel) {
        this.setState({ createdModel });
      }
    }
  }

  private handleDragMove(position: Point, initial: Point) {
    const { createdModel } = this.state;

    if (!!createdModel) {
      this.setState({
        createdModel: createdModel.setNextPoint(position),
      });
    }
  }

  private handleDragEnd(position: Point, initial: Point) {
    const { createdModel, scene } = this.state;

    if (!!createdModel) {
      const model = createdModel.setNextPoint(position).model;
      this.setState({ createdModel: undefined });
      this.content.addModel(model);
    }
  }

  private handleOneClick(position: Point) {
    // Nothing to do right now
  }

  private get sceneThickness(): number {
    // thickness in scene coordinates
    return this.props.lineThickness / this.positioning.scale;
  }

  private static getMouseCoordinates(
    event: MouseEvent,
    element: HTMLElement,
  ): Point {
    // in screen coordinates
    const rect = element.getBoundingClientRect();
    const x = event.pageX - rect.left - window.pageXOffset;
    const y = event.pageY - rect.top - window.pageYOffset;

    return { x, y };
  }
}
