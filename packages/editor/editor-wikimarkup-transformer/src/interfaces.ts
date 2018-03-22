import { Node as PMNode } from 'prosemirror-model';

export type MacroName = 'code' | 'color' | 'noformat' | 'panel' | 'quote';

export interface Interval {
  left: number;
  right: number;
}

export interface IntervalWithPMNodes {
  left: number;
  right: number;
  content: PMNode[];
}

export interface MacroMatch {
  macro: MacroName;
  startPos: number;
  endPos: number;
  attrs: { [key: string]: string };
}
