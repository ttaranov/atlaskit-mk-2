import { Rectangle } from './geometry';
import { Model } from './model';

// Describes rendered objects
export interface Scene {
  boundingRect: Rectangle; // in scene coordinates
  models: Model[]; // models to render
}
