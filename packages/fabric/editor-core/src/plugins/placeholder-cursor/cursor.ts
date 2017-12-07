import {
  EditorState,
  TextSelection,
  Selection,
  SelectionBookmark,
  Transaction,
} from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Slice, Node, ResolvedPos } from 'prosemirror-model';
import { Mappable } from 'prosemirror-transform';

export class PlaceholderBookmark {
  pos: undefined | number = undefined;
  visible: boolean = false;

  constructor(pos: number) {
    this.pos = pos;
  }

  map(mapping: Mappable): PlaceholderBookmark {
    return new PlaceholderBookmark(mapping.map(this.pos!));
  }

  resolve(doc: Node): Selection {
    const $pos = doc.resolve(this.pos!);
    return Selection.near($pos);
  }
}

export class PlaceholderCursor extends Selection {
  constructor($pos: ResolvedPos) {
    super($pos, $pos);
  }

  map(doc: Node, mapping: Mappable): Selection {
    const $pos = doc.resolve(mapping.map(this.$head.pos));
    return new PlaceholderCursor($pos);
  }

  static content(): Slice {
    return Slice.empty;
  }

  eq(other): boolean {
    return other instanceof PlaceholderCursor && other.head === this.head;
  }

  toJSON(): any {
    return { type: 'Cursor', pos: this.head };
  }

  static fromJSON(doc: Node, json: any): Selection {
    return new PlaceholderCursor(doc.resolve(json.pos));
  }

  getBookmark(): SelectionBookmark {
    return new PlaceholderBookmark(this.anchor) as SelectionBookmark;
  }
}

Selection.jsonID('placeholder-cursor', PlaceholderCursor);

export const addPlaceholderCursor = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
) => {
  const { selection } = state;
  if (selection.empty) {
    const { selection: { $from } } = state;
    dispatch(state.tr.setSelection(new PlaceholderCursor($from) as any));
  }
};

export const removePlaceholderCursor = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
) => {
  if (state.selection instanceof PlaceholderCursor) {
    const { $from } = state.selection;
    dispatch(state.tr.setSelection(new TextSelection($from) as any));
  }
};

export const drawPlaceholderCursor = (
  state: EditorState,
): DecorationSet | null => {
  if (!(state.selection instanceof PlaceholderCursor)) {
    return null;
  }
  const node = document.createElement('div');
  node.className = 'ProseMirror-placeholder-cursor';
  return DecorationSet.create(state.doc, [
    Decoration.widget(state.selection.head, node, { key: 'Cursor' }),
  ]);
};
