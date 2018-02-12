import { Node, Schema } from 'prosemirror-model';
import {
  EditorState,
  Plugin,
  PluginKey,
  TextSelection,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export class StatusState {
  private state: EditorState;
  private changeHandlers: StatusStateSubscriber[] = [];

  element?: HTMLElement | undefined;
  statusElement?: HTMLElement | undefined;
  activeStatus?: boolean | undefined;
  toolbarVisible?: boolean | undefined;
  editorFocused: boolean = false;

  constructor(state: EditorState) {
    this.changeHandlers = [];
    this.state = state;
    this.toolbarVisible = false;
  }

  updateEditorFocused(editorFocused: boolean) {
    this.editorFocused = editorFocused;
  }

  removeStatus(view: EditorView) {
    const { dispatch, state } = view;
    let { tr } = state;
    let { $from, $to } = state.selection;
    let from, to;
    for (from = $from.pos; from > 0; from--) {
      const pos = state.tr.doc.resolve(from);
      if (!pos.marks().some(mark => mark.type.name === 'confluenceStatus')) {
        break;
      }
    }
    for (to = $to.pos; ; to++) {
      const pos = state.tr.doc.resolve(to);
      if (!pos.marks().some(mark => mark.type.name === 'confluenceStatus')) {
        break;
      }
    }
    tr = tr
      .delete(from, to)
      .removeStoredMark(state.schema.marks.confluenceStatus);
    dispatch(tr);
  }

  changeStatus(view: EditorView, status: number) {
    const { dispatch, state } = view;
    let { tr } = state;
    let { $from, $to } = state.selection;
    let from = $from.pos;
    let to = $to.pos;
    for (; from > 0; from--) {
      const pos = state.tr.doc.resolve(from);
      if (!pos.marks().some(mark => mark.type.name === 'confluenceStatus')) {
        break;
      }
    }
    for (; ; to++) {
      const pos = state.tr.doc.resolve(to);
      if (!pos.marks().some(mark => mark.type.name === 'confluenceStatus')) {
        break;
      }
    }
    const newMark = state.schema.marks.confluenceStatus.create({ status });
    tr = tr
      .removeMark(from, to, state.schema.marks.confluenceStatus)
      .removeStoredMark(state.schema.marks.confluenceStatus)
      .addMark(from, to, newMark)
      .addStoredMark(newMark);
    dispatch(tr);
  }

  subscribe(cb: StatusStateSubscriber) {
    this.changeHandlers.push(cb);
    cb(this);
  }

  unsubscribe(cb: StatusStateSubscriber) {
    this.changeHandlers = this.changeHandlers.filter(ch => ch !== cb);
  }

  // TODO: Fix types (ED-2987)
  update(state: EditorState, docView: any, domEvent: boolean = false) {
    this.state = state;
    const oldActiveStatus = this.activeStatus;
    this.activeStatus = this.getActiveStatus(docView);
    this.statusElement = this.getStatusElement(docView);
    if (this.activeStatus || oldActiveStatus) {
      this.changeHandlers.forEach(cb => cb(this));
    }
  }

  private getActiveStatus(docView: any): boolean | undefined {
    const { state } = this;
    const { $from, $to } = state.selection;
    if (
      state.storedMarks &&
      state.storedMarks.some(mark => mark.type.name === 'confluenceStatus')
    ) {
      return true;
    }
    for (let i = $from.pos; i <= $to.pos; i++) {
      const pos = state.tr.doc.resolve(i);
      if (!pos.marks().some(mark => mark.type.name === 'confluenceStatus')) {
        return;
      }
    }
    return true;
  }

  private getStatusElement(docView: any): HTMLElement | undefined {
    const { state: { selection } } = this;
    if (selection instanceof TextSelection) {
      const { node } = docView.domFromPos(selection.$from.pos);
      return node as HTMLElement;
    }
  }
}

export type StatusStateSubscriber = (state: StatusState) => any;

export const stateKey = new PluginKey('statusPlugin');

// TODO: Fix types (ED-2987)
export const createPlugin = () =>
  new Plugin({
    state: {
      init(config, state: EditorState) {
        return new StatusState(state);
      },
      apply(tr, pluginState: StatusState, oldState, newState) {
        const stored = tr.getMeta(stateKey);
        if (stored) {
          pluginState.update(newState, stored.docView, stored.domEvent);
        }
        return pluginState;
      },
    },
    key: stateKey,
    view: (view: EditorView) => {
      return {
        update: (
          view: EditorView & { docView?: any },
          prevState: EditorState,
        ) => {
          stateKey.getState(view.state).update(view.state, view.docView);
        },
      };
    },
    props: {
      handleClick(view: EditorView & { docView?: any }, event) {
        stateKey.getState(view.state).update(view.state, view.docView, true);
        return false;
      },
    },
  });

const plugins = (schema: Schema) => {
  return [createPlugin()].filter(plugin => !!plugin) as Plugin[];
};

export default plugins;
