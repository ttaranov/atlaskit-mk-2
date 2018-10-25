import * as React from 'react';

import { ImageModel } from '../../scene';

export interface ImageRendererProps {
  model: ImageModel;
}

export class ImageRenderer extends React.Component<ImageRendererProps, {}> {
  render() {
    const { url, rect } = this.props.model;
    const { origin, size } = rect;
    const { x, y } = origin;
    const { width, height } = size;

    return <image xlinkHref={url} x={x} y={y} width={width} height={height} />;
  }
}
