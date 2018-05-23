import { Mark, Node, Schema } from 'prosemirror-model';
import {
  EditorState,
  Plugin,
  TextSelection,
  Transaction,
  PluginKey,
} from 'prosemirror-state';
import { Step, ReplaceStep } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import { isMarkTypeAllowedInCurrentSelection } from '../../../utils';
import { EditorProps } from '../../../types/editor-props';
import {
  addFakeTextCursor,
  removeFakeTextCursor,
  FakeTextCursorSelection,
} from '../../../plugins/fake-text-cursor/cursor';
import { Match, getLinkMatch, normalizeUrl } from '../utils';

export const hyperlinkPluginKey = new PluginKey('hyperlinkPlugin');

export type HyperlinkStateSubscriber = (state: HyperlinkState) => any;
export type StateChangeHandler = (state: HyperlinkState) => any;
export interface HyperlinkOptions {
  href: string;
  text?: string;
}
export type Coordinates = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};
interface NodeInfo {
  node: Node;
  startPos: number;
}

export class HyperlinkState {
  // public state
  href?: string;
  text?: string;
  active = false;
  linkable = false;
  editorFocused = false;
  element?: HTMLElement;
  activeElement?: HTMLElement;
  showToolbarPanel = false;
  activeLinkNode?: Node;

  private changeHandlers: StateChangeHandler[] = [];
  private state: EditorState;
  private activeLinkMark?: Mark;
  private activeLinkStartPos?: number;

  constructor(state: EditorState) {
    this.changeHandlers = [];
  }

  subscribe(cb: HyperlinkStateSubscriber) {
    this.changeHandlers.push(cb);
    cb(this);
  }

  unsubscribe(cb: HyperlinkStateSubscriber) {
    this.changeHandlers = this.changeHandlers.filter(ch => ch !== cb);
  }

  addLink(options: HyperlinkOptions, view: EditorView) {
    if (this.linkable && !this.active) {
      const { state } = this;
      const { href, text } = options;
      const { empty, $from, $to } = state.selection;
      const mark = state.schema.mark('link', { href: normalizeUrl(href) });
      const tr = empty
        ? state.tr.insert($from.pos, state.schema.text(text || href, [mark]))
        : state.tr.addMark($from.pos, $to.pos, mark);

      view.dispatch(tr);
    }
  }

  removeLink(view: EditorView) {
    if (this.activeLinkStartPos) {
      const { state } = this;
      const from = this.activeLinkStartPos;
      const to = from + this.text!.length;

      view.dispatch(state.tr.removeMark(from, to, this.activeLinkMark));
      view.focus();
    }
  }

  updateLink(options: HyperlinkOptions, view: EditorView) {
    if (this.activeLinkStartPos) {
      const { state } = this;
      const from = this.activeLinkStartPos;
      const to = this.activeLinkStartPos + this.text!.length;
      view.dispatch(
        state.tr
          .removeMark(from, to, this.activeLinkMark)
          .addMark(
            from,
            to,
            state.schema.mark('link', { href: normalizeUrl(options.href) }),
          ),
      );
    }
  }

  updateLinkText(text: string, view: EditorView) {
    if (this.activeLinkStartPos) {
      const { state } = this;
      const from = this.activeLinkStartPos;
      const to = from + (this.text ? this.text.length : 0);
      const newTo = from + (text ? text.length : 0);
      view.dispatch(
        state.tr
          .insertText(text, from, to)
          .addMark(from, newTo, this.activeLinkMark!),
      );
      view.focus();
    }
  }

  // TODO: Fix types (ED-2987)
  update(editorView: EditorView & { docView?: any }, dirty: boolean = false) {
    const { state, docView } = editorView;
    this.state = state;

    const nodeInfo = this.getActiveLinkNodeInfo();
    const canAddLink = this.isActiveNodeLinkable();

    if (canAddLink !== this.linkable) {
      this.linkable = canAddLink;
      dirty = true;
    }

    if (
      !(state.selection instanceof FakeTextCursorSelection) &&
      this.showToolbarPanel
    ) {
      this.showToolbarPanel = false;
      dirty = true;
    }

    if ((nodeInfo && nodeInfo.node) !== this.activeLinkNode) {
      this.activeLinkNode = nodeInfo && nodeInfo.node;
      this.activeLinkStartPos = nodeInfo && nodeInfo.startPos;
      this.activeLinkMark = nodeInfo && this.getActiveLinkMark(nodeInfo.node);
      this.text = nodeInfo && nodeInfo.node.textContent;
      this.href = this.activeLinkMark && this.activeLinkMark.attrs.href;
      this.active = !!nodeInfo;
      dirty = true;
    }
    this.element = this.getDomElement(docView);
    this.activeElement = this.getActiveDomElement(state.selection, docView);

    if (dirty) {
      this.triggerOnChange();
    }
  }

  escapeFromMark(editorView: EditorView) {
    const nodeInfo = this.getActiveLinkNodeInfo();
    if (nodeInfo && this.isShouldEscapeFromMark(nodeInfo)) {
      const transaction = this.state.tr.removeMark(
        nodeInfo.startPos,
        this.state.selection.$from.pos,
        this.state.schema.marks.link,
      );

      editorView.dispatch(transaction);
    }
  }

  showLinkPanel = (editorView: EditorView & { docView?: any }) => {
    if (this.linkable) {
      if (!(this.showToolbarPanel || editorView.hasFocus())) {
        editorView.focus();
      }
      const { selection } = editorView.state;
      if (selection.empty && !this.active) {
        this.showToolbarPanel = !this.showToolbarPanel;
        this.changeHandlers.forEach(cb => cb(this));
      } else {
        this.addLink({ href: '' }, editorView);
        this.update(editorView);
      }
      addFakeTextCursor(editorView.state, editorView.dispatch);
      return true;
    }
    return false;
  };

  hideLinkPanel(state: EditorState, dispatch: (tr: Transaction) => void) {
    this.showToolbarPanel = false;
    this.changeHandlers.forEach(cb => cb(this));
    removeFakeTextCursor(state, dispatch);
  }

  setInactive(state: EditorState, dispatch: (tr: Transaction) => void) {
    this.active = false;
    this.changeHandlers.forEach(cb => cb(this));
    removeFakeTextCursor(state, dispatch);
  }

  getCoordinates(
    editorView: EditorView & { docView?: any },
    offsetParent: Element,
  ): Coordinates {
    if (editorView.hasFocus()) {
      editorView.focus();
    }
    const { pos } = this.state.selection.$from;
    const { left, top, height } = offsetParent.getBoundingClientRect();
    const { node } = editorView.docView.domFromPos(pos);

    const cursorNode =
      node.nodeType === 3 // Node.TEXT_NODE = 3
        ? (node.parentNode as HTMLElement)
        : (node as HTMLElement);
    const cursorHeight = parseFloat(
      window.getComputedStyle(cursorNode, undefined).lineHeight || '',
    );
    /**
     * We need to translate the co-ordinates because `coordsAtPos` returns co-ordinates
     * relative to `window`. And, also need to adjust the cursor container height.
     * (0, 0)
     * +--------------------- [window] ---------------------+
     * |   (left, top) +-------- [Offset Parent] --------+  |
     * | {coordsAtPos} | [Cursor]   <- cursorHeight      |  |
     * |               | [FloatingToolbar]               |  |
     */
    const translateCoordinates = (
      coords: Coordinates,
      dx: number,
      dy: number,
    ) => {
      return {
        left: coords.left - dx,
        right: coords.right - dx,
        top:
          coords.top -
          dy +
          (offsetParent === document.body ? 0 : offsetParent.scrollTop),
        bottom:
          height -
          (coords.top - dy) -
          (offsetParent === document.body ? 0 : offsetParent.scrollTop),
      };
    };
    return translateCoordinates(
      editorView.coordsAtPos(this.activeLinkStartPos || pos),
      left,
      top - cursorHeight,
    );
  }

  private triggerOnChange() {
    this.changeHandlers.forEach(cb => cb(this));
  }

  private isShouldEscapeFromMark(nodeInfo: NodeInfo | undefined) {
    const parentOffset = this.state.selection.$from.parentOffset;
    return (
      nodeInfo && parentOffset === 1 && nodeInfo.node.nodeSize > parentOffset
    );
  }

  private getActiveLinkNodeInfo(): NodeInfo | undefined {
    const { state } = this;
    const { link } = state.schema.marks;
    const { $from, empty } = state.selection as TextSelection;

    if (link && $from) {
      const { node, offset } = $from.parent.childAfter($from.parentOffset);
      const parentNodeStartPos = $from.start($from.depth);

      // offset is the end position of previous node
      // This is to check whether the cursor is at the beginning of current node
      if (empty && offset + 1 === $from.pos) {
        return;
      }

      if (node && node.isText && link.isInSet(node.marks)) {
        return {
          node,
          startPos: parentNodeStartPos + offset,
        };
      }
    }
  }

  private getActiveLinkMark(activeLinkNode: Node): Mark | undefined {
    const linkMarks = activeLinkNode.marks.filter(mark => {
      return mark.type === this.state.schema.marks.link;
    });

    return (linkMarks as Mark[])[0];
  }

  private getDomElement(docView: any): HTMLElement | undefined {
    if (this.activeLinkStartPos) {
      const { node, offset } = docView.domFromPos(this.activeLinkStartPos);

      if (node.childNodes.length === 0) {
        return node.parentNode as HTMLElement;
      }

      return node.childNodes[offset] as HTMLElement;
    }
  }

  /**
   * Returns active dom element for current selection.
   * Used by Hyperlink edit popup to position relative to cursor.
   */
  private getActiveDomElement(
    selection,
    docView: any,
  ): HTMLElement | undefined {
    if (selection.$from.pos !== selection.$to.pos) {
      return;
    }

    const { node } = docView.domFromPos(selection.$from.pos);

    return node as HTMLElement;
  }

  private isActiveNodeLinkable(): boolean {
    const { link } = this.state.schema.marks;
    return !!link && isMarkTypeAllowedInCurrentSelection(link, this.state);
  }
}

function isReplaceStep(step?: Step): step is ReplaceStep {
  return !!step && step instanceof ReplaceStep;
}
const hasLinkMark = (schema: any, node?: Node | null) =>
  node && (schema.marks.link.isInSet(node.marks) as Mark | null);

function updateLinkOnChange(
  transactions: Transaction[],
  oldState: EditorState,
  newState: EditorState,
  isMessageEditor: boolean,
): Transaction | undefined {
  if (!transactions) {
    return;
  }

  if (transactions.some(tr => tr.steps.some(isReplaceStep))) {
    const { schema } = newState;

    const {
      nodeAfter: oldNodeAfter,
      nodeBefore: oldNodeBefore,
    } = oldState.selection.$from;
    const oldLinkMarkAfter = hasLinkMark(schema, oldNodeAfter);
    const oldLinkMarkBefore = hasLinkMark(schema, oldNodeBefore);

    const { $from } = newState.selection;
    const { nodeAfter: newNodeAfter, nodeBefore: newNodeBefore } = $from;
    const newLinkMarkAfter = hasLinkMark(schema, newNodeAfter);
    const newLinkMarkBefore = hasLinkMark(schema, newNodeBefore);

    if (
      !(
        oldNodeBefore &&
        oldLinkMarkBefore &&
        newNodeBefore &&
        newLinkMarkBefore
      )
    ) {
      return;
    }

    let href;
    let end = $from.pos;
    const start = end - newNodeBefore.nodeSize;
    let hasSameUrlAndTitle = false;

    if (
      oldNodeAfter &&
      oldLinkMarkAfter &&
      oldLinkMarkBefore.attrs.href ===
        normalizeUrl(`${oldNodeBefore.text}${oldNodeAfter.text}`)
    ) {
      hasSameUrlAndTitle = true;
      if (newNodeAfter && newLinkMarkAfter) {
        // Middle of a link https://goo<|>gle.com/
        end += newNodeAfter.nodeSize;
        href = `${newNodeBefore.text}${newNodeAfter.text}`;
      } else {
        // Replace end of a link https://goo<|gle.com/|>
        href = newNodeBefore.text;
      }
    } else if (
      // The if else condition takes care of condition where text was linkified as it was valid link,
      // even if a href is not explicitly added.
      // In those cases if replaced text is no more a valid link it should be de-linkified.
      oldLinkMarkBefore.attrs.href === normalizeUrl(oldNodeBefore.text || '') &&
      // The following condition ensures that delinkification is done only if
      // the new replaced text does not adds a new mark. Ref: #ED-3369.
      oldLinkMarkBefore === newLinkMarkBefore
    ) {
      hasSameUrlAndTitle = true;
      // End of a link https://google.com/<|>
      if (newNodeBefore.text !== oldNodeBefore.text) {
        href = newNodeBefore.text;
      }
    }

    const match: Match | null = getLinkMatch(href);
    if (match || (isMessageEditor && hasSameUrlAndTitle)) {
      const tr = newState.tr.removeMark(start, end, schema.marks.link);
      if (match) {
        const markType = schema.mark('link', { href: match.url });
        tr.addMark(start, end, markType);
      }
      return tr;
    }
  }
}

export const createPlugin = (schema: Schema, editorProps: EditorProps = {}) =>
  new Plugin({
    props: {
      handleTextInput(
        view: EditorView,
        from: number,
        to: number,
        text: string,
      ) {
        const pluginState = hyperlinkPluginKey.getState(view.state);
        pluginState.escapeFromMark(view);

        return false;
      },
      handleClick(view: EditorView) {
        const pluginState = hyperlinkPluginKey.getState(view.state);
        if (pluginState.active) {
          pluginState.changeHandlers.forEach(cb => cb(pluginState));
        }
        return false;
      },
      handleDOMEvents: {
        blur(view, event) {
          const pluginState = hyperlinkPluginKey.getState(view.state);
          pluginState.editorFocused = false;
          if (pluginState.active) {
            pluginState.changeHandlers.forEach(cb => cb(pluginState));
          }
          event.preventDefault();
          return false;
        },
        focus(view, event) {
          const pluginState = hyperlinkPluginKey.getState(view.state);
          pluginState.editorFocused = true;

          event.preventDefault();
          return false;
        },
      },
    },
    state: {
      init(config, state: EditorState) {
        return new HyperlinkState(state);
      },
      apply(tr, pluginState: HyperlinkState, oldState, newState) {
        return pluginState;
      },
    },
    key: hyperlinkPluginKey,
    view: (view: EditorView & { docView?: any }) => {
      const pluginState = hyperlinkPluginKey.getState(view.state);
      pluginState.update(view, true);

      return {
        update: (
          view: EditorView & { docView?: any },
          prevState: EditorState,
        ) => {
          pluginState.update(view);
        },
      };
    },
    appendTransaction: (transactions, oldState, newState) => {
      return updateLinkOnChange(
        transactions,
        oldState,
        newState,
        editorProps.appearance === 'message',
      );
    },
  });
