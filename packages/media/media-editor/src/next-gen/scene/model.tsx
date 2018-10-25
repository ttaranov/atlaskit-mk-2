import { Rectangle } from './geometry';

export interface Model {
  id: string; // every model must have an id
  type: 'image';
}

export interface ImageModel extends Model {
  type: 'image';
  url: string;
  rect: Rectangle;
}
