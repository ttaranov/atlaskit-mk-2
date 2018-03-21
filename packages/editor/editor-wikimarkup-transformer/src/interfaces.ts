import { Mark, Node as PMNode, NodeType } from 'prosemirror-model';

export type MacroName = 'code' | 'noformat' | 'panel' | 'quote';

export interface MacrosMatchPosition {
  inner: number;
  outer: number;
}

export interface TreeNodeMacro {
  type: 'macro';
  macro: MacroName;
  attrs: { [key: string]: string };
  startPos: MacrosMatchPosition;
  endPos: MacrosMatchPosition;
  content: TreeNode[];
}

export interface TreeNodeText {
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
  content?: TreeNodeText[];
  text?: string;
}

export interface TreeNodeRoot {
  type: 'root';
  content: TreeNode[];
}

export type TreeNode = TreeNodeRoot | TreeNodeMacro | TreeNodeText;

export interface SimpleInterval {
  left: number;
  right: number;
}

export interface MacroMatch {
  macro: MacroName;
  attrs: { [key: string]: string };
  startPos: MacrosMatchPosition;
  endPos: MacrosMatchPosition;
}
