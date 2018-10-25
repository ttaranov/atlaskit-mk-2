import * as React from 'react';

import { Scene, ImageModel } from '../scene';
import { Camera } from './camera';
import { ImageRenderer } from './renderers';

export interface RenderingPlaneProps {
  scene: Scene;
  camera: Camera;
}

export class RenderingPlane extends React.Component<RenderingPlaneProps> {
  render() {
    const { scene, camera } = this.props;
    const { windowSize } = camera;
    const { width: windowWidth, height: windowHeight } = windowSize;

    return (
      <svg width={windowWidth} height={windowHeight}>
        {scene.models.map(model => {
          const { id, type } = model;

          switch (type) {
            case 'image':
              return <ImageRenderer key={id} model={model as ImageModel} />;

            default:
              return null;
          }
        })}
      </svg>
    );
  }
}
