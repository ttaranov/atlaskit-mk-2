import * as React from 'react';

import { ImageRenderer } from './imageRenderer';
import { Model, ImageModel } from '../../scene';

export function createRenderer(model: Model, key?: string): JSX.Element | null {
  switch (model.type) {
    case 'image':
      return <ImageRenderer key={key} model={model as ImageModel} />;
  }
}
