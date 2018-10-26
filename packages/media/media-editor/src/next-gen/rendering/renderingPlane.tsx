import * as React from 'react';

import { Scene, Model, Rectangle } from '../scene';
import { Camera } from './camera';
import { createRenderer } from './renderers';

export interface RenderingPlaneProps {
  camera: Camera;
  scene: Scene;
  createdModels: Model[];
}

export class RenderingPlane extends React.Component<RenderingPlaneProps> {
  render() {
    const { scene, camera, createdModels } = this.props;
    const { windowSize } = camera;
    const { width: windowWidth, height: windowHeight } = windowSize;
    const viewBox = this.viewBox;
    const { x: xMin, y: yMin } = viewBox.origin;
    const { width: viewBoxWidth, height: viewBoxHeight } = viewBox.size;

    const viewBoxString = `${xMin} ${yMin} ${viewBoxWidth} ${viewBoxHeight}`;

    return (
      <svg
        width={windowWidth}
        height={windowHeight}
        viewBox={viewBoxString}
        preserveAspectRatio="xMidYMid meet"
      >
        {scene.models.map(model => createRenderer(model, model.id))}
        {createdModels.map(model => createRenderer(model, model.id))}
      </svg>
    );
  }

  private get viewBox(): Rectangle {
    const { camera } = this.props;
    const { width: windowWidth, height: windowHeight } = camera.windowSize;
    const { scale, center } = camera;

    const scaledWidth = windowWidth / scale;
    const scaledHeight = windowHeight / scale;

    const x = center.x - scaledWidth / 2;
    const y = center.y - scaledHeight / 2;

    return {
      origin: { x, y },
      size: { width: scaledWidth, height: scaledHeight },
    };
  }
}
