import { Camera } from './rendering';
import { Size } from './scene';

export class Positioning implements Camera {
  constructor(public windowSize: Size, private onCameraChanged: () => void) {}
}
