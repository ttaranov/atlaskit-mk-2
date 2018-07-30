import { EditorState } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { TypeAheadItem } from '../type-ahead/types';

export type QuickInsertItem = TypeAheadItem & {
  keywords?: Array<string>;
  priority?: number;
  action: (
    insert: (node?: Node | Object | string, prependSpace?: boolean) => boolean,
    state: EditorState,
  ) => boolean;
};

export type QuickInsertProvider = {
  getItems: () => Promise<Array<QuickInsertItem>>;
};

export type QuickInsertOptions =
  | boolean
  | {
      provider: Promise<QuickInsertProvider>;
    };
