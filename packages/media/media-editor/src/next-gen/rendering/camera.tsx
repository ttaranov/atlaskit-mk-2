import { Size, Point } from '../scene';

export interface Camera {
  windowSize: Size; // size of the output window
  center: Point; // camera center in scene coordinates
  scale: number; // zoom level
}
