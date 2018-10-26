import { Rectangle, Point } from './geometry';
import { Color } from '../common';

export interface Model {
  id: string; // every model must have an id
  type: 'image' | 'line' | 'rectangle' | 'oval';
  color: Color;
  thickness: number;
}

export interface ImageModel extends Model {
  type: 'image';
  url: string;
  rect: Rectangle;
}

export interface LinearModel extends Model {
  start: Point;
  end: Point;
}

export interface LineModel extends LinearModel {
  type: 'line';
}

export interface RectangleModel extends LinearModel {
  type: 'rectangle';
}

export interface OvalModel extends LinearModel {
  type: 'oval';
}
