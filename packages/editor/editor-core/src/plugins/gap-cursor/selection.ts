import { Selection } from 'prosemirror-state';
import { Mapping } from 'prosemirror-transform';
import { Slice, ResolvedPos, Node as PMNode } from 'prosemirror-model';
import { isIgnored } from './utils';

export enum Side {
  RIGHT,
  LEFT,
}

export const JSON_ID = 'gapcursor';

export class GapCursorSelection extends Selection {
  readonly visible: boolean = false;

  // indicates the side of a block node where the gap cursor is drawn (LEFT or RIGHT)
  readonly side: Side;

  constructor($pos: ResolvedPos, side: Side = Side.LEFT) {
    super($pos, $pos);
    this.side = side;
  }

  map(doc: PMNode, mapping: Mapping): Selection {
    const $pos = doc.resolve(mapping.map(this.head));
    return GapCursorSelection.valid($pos)
      ? new GapCursorSelection($pos, this.side)
      : Selection.near($pos);
  }

  content() {
    return Slice.empty;
  }

  eq(other: Selection): boolean {
    return other instanceof GapCursorSelection && other.head === this.head;
  }

  toJSON() {
    return { pos: this.head, type: JSON_ID };
  }

  static fromJSON(doc: PMNode, json: { pos: number; type: string }) {
    return new GapCursorSelection(doc.resolve(json.pos));
  }

  getBookmark() {
    return new GapBookmark(this.anchor);
  }

  static valid($pos: ResolvedPos): boolean {
    const { parent, nodeBefore, nodeAfter } = $pos;
    let targetNode;
    if (nodeBefore && !isIgnored(nodeBefore)) {
      targetNode = nodeBefore;
    } else if (nodeAfter && !isIgnored(nodeAfter)) {
      targetNode = nodeAfter;
    }

    if (!targetNode || parent.isTextblock) {
      return false;
    }
    const override = (parent.type.spec as any).allowGapCursor;
    if (override) {
      return override;
    }
    const deflt = (parent.contentMatchAt($pos.index()) as any).defaultType;
    return deflt && deflt.isTextblock;
  }

  public static findFrom($pos: ResolvedPos, dir: number, mustMove = false) {
    const side = dir === 1 ? Side.RIGHT : Side.LEFT;

    if (!mustMove && GapCursorSelection.valid($pos)) {
      return new GapCursorSelection($pos, side);
    }

    let pos: number = $pos.pos;

    // TODO: Fix any, potential issue. ED-5048
    let next: any = null;

    // Scan up from this position
    for (let d = $pos.depth; ; d--) {
      const parent = $pos.node(d);
      if (
        side === Side.RIGHT
          ? $pos.indexAfter(d) < parent.childCount
          : $pos.index(d) > 0
      ) {
        next = parent.maybeChild(
          side === Side.RIGHT ? $pos.indexAfter(d) : $pos.index(d) - 1,
        );
        break;
      } else if (d === 0) {
        return;
      }
      pos += dir;
      const $cur = $pos.doc.resolve(pos);
      if (GapCursorSelection.valid($cur)) {
        return new GapCursorSelection($cur, side);
      }
    }

    // And then down into the next node
    for (;;) {
      next = side === Side.RIGHT ? next.firstChild : next.lastChild;
      if (next === null) {
        break;
      }
      pos += dir;
      const $cur = $pos.doc.resolve(pos);
      if (GapCursorSelection.valid($cur)) {
        return new GapCursorSelection($cur, side);
      }
    }

    return null;
  }
}

Selection.jsonID(JSON_ID, GapCursorSelection);

export class GapBookmark {
  private readonly pos: number;

  constructor(pos) {
    this.pos = pos;
  }

  map(mapping) {
    return new GapBookmark(mapping.map(this.pos));
  }

  resolve(doc) {
    const $pos = doc.resolve(this.pos);
    return GapCursorSelection.valid($pos)
      ? new GapCursorSelection($pos)
      : Selection.near($pos);
  }
}
