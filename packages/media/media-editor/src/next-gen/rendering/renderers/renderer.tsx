import * as React from 'react';

import { ImageRenderer } from './imageRenderer';
import { LineRenderer } from './lineRenderer';
import { RectangleRenderer } from './rectangleRenderer';
import { OvalRenderer } from './ovalRenderer';
import {
  Model,
  ImageModel,
  LineModel,
  RectangleModel,
  OvalModel,
} from '../../scene';

export function createRenderer(model: Model, key?: string): JSX.Element | null {
  switch (model.type) {
    case 'image':
      return <ImageRenderer key={key} model={model as ImageModel} />;

    case 'line':
      return <LineRenderer key={key} model={model as LineModel} />;

    case 'rectangle':
      return <RectangleRenderer key={key} model={model as RectangleModel} />;

    case 'oval':
      return <OvalRenderer key={key} model={model as OvalModel} />;

    default:
      return null;
  }
}
