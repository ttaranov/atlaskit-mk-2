// import { Node as PMNode } from 'prosemirror-model';

export type MacroName = 'code' | 'noformat' | 'panel' | 'quote';

export interface SimpleInterval {
  left: number;
  right: number;
}

export interface MacrosMatchPosition {
  inner: number;
  outer: number;
}

export interface NodeText {
  // all the things JIRA wiki markup supports
  // @see https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=all
  type:
    | 'blockquote'
    | 'hardBreak'
    | 'heading'
    | 'rule'
    | 'bulletList'
    | 'orderedList'
    | 'image'
    | 'table'
    | 'text'
    | 'paragraph';
  attrs?: { [key: string]: string };
  content?: NodeText[];
  text?: string;
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
  macros: SimpleMacro[];
  text: string;
  content: NodeText[];
}
