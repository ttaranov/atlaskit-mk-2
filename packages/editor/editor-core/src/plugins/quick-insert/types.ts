import { EditorState } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { TypeAheadItem } from '../type-ahead/types';

export type QuickInsertItem = TypeAheadItem & {
  keywords?: Array<string>;
  action: (
    insert: (node?: Node, prependSpace?: boolean) => boolean,
    state: EditorState,
  ) => boolean;
};
