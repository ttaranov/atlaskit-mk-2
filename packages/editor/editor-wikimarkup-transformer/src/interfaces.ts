import { Node as PMNode } from 'prosemirror-model';

export type MacroName = 'code' | 'noformat' | 'panel' | 'quote';

export interface SimpleInterval {
  left: number;
  right: number;
}

export interface MacrosMatchPosition {
  inner: number;
  outer: number;
}

export interface SimpleMacro {
  macro: MacroName;
  attrs: { [key: string]: string };
}

export interface MacroMatch {
  macro: MacroName;
  attrs: { [key: string]: string };
  startPos: MacrosMatchPosition;
  endPos: MacrosMatchPosition;
}

export interface Interval {
  macros: SimpleMacro[];
  text: string;
}

export interface RichInterval {
  macro?: SimpleMacro;
  text: string;
  content: PMNode[];
}
