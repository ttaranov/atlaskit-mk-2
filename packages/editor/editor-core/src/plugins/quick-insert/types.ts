import { EditorState } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { TypeAheadItem } from '../type-ahead/types';

export type QuickInsertItem = TypeAheadItem & {
  keywords?: Array<string>;
  action: (
    replaceWith: (node?: Node) => boolean,
    state: EditorState,
  ) => boolean;
};
