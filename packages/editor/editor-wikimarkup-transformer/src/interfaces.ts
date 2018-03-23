import { Node as PMNode } from 'prosemirror-model';

export type MacroName = 'color' | 'code' | 'noformat' | 'panel' | 'quote';
export type TextEffect =
  | 'strong'
  | 'emphasis'
  | 'citation'
  | 'deleted'
  | 'inserted'
  | 'superscript'
  | 'subscript'
  | 'monospaced'
  | 'color'
  | 'link';

export interface SimpleInterval {
  left: number;
  right: number;
}

export interface MatchPosition {
  inner: number;
  outer: number;
}

export interface FatInterval {
  startPos: MatchPosition;
  endPos: MatchPosition;
}

export interface SimpleMacro {
  macro: MacroName;
  attrs: { [key: string]: string };
}

export interface MacroMatch extends FatInterval {
  macro: MacroName;
  attrs: { [key: string]: string };
}

export interface TextMatch extends FatInterval {
  effect: TextEffect;
  attrs: { [key: string]: string | null };
}

export interface MacroInterval {
  macros: SimpleMacro[];
  text: string;
}

export interface Effect {
  name: TextEffect;
  attrs: { [key: string]: string | null };
}

export interface TextInterval {
  effects: Effect[];
  text: string;
}

export interface RichInterval {
  macro?: SimpleMacro;
  text: string;
  content: PMNode[];
}
