/// <reference types="react" />
import { MouseEvent } from 'react';
export interface Position {
  x: number;
  y: number;
}
export declare function mouseLocation(event: MouseEvent<any>): Position;
export declare function actualMouseMove(
  oldPosition: Position | undefined,
  newPosition: Position,
): boolean;
export declare function leftClick(event: MouseEvent<any>): boolean;
