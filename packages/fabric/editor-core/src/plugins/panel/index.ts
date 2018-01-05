import { analyticsService } from '../../analytics';
import { Node, Schema } from 'prosemirror-model';
import {
  EditorState,
  Plugin,
  PluginKey,
  TextSelection,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { panelNodeView } from '../../nodeviews';

export interface PanelType {
  panelType: 'info' | 'note' | 'tip' | 'warning';
}

export const availablePanelType = [
  { panelType: 'info' },
  { panelType: 'note' },
  { panelType: 'tip' },
  { panelType: 'warning' },
];

export class PanelState {
  private state: EditorState;
  private activeNode: Node | undefined;
  private changeHandlers: PanelStateSubscriber[] = [];

  element?: HTMLElement | undefined;
  activePanelType?: string | undefined;
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

  changePanelType(view: EditorView, panelType: PanelType) {
    analyticsService.trackEvent(
      `atlassian.editor.format.${panelType.panelType}.button`,
    );
    const { state, dispatch } = view;
    let { tr } = state;
    const { panel } = state.schema.nodes;
    const { $from, $to } = state.selection;
    let newFrom = tr.doc.resolve($from.start($from.depth - 1));
    let newTo = tr.doc.resolve($to.end($to.depth - 1));
    let range = newFrom.blockRange(newTo)!;
    tr.lift(range, $from.depth - 2);
    newFrom = tr.doc.resolve(tr.mapping.map(newFrom.pos));
    newTo = tr.doc.resolve(tr.mapping.map(newTo.pos));
    range = newFrom.blockRange(newTo)!;
    tr = tr.wrap(range, [{ type: panel, attrs: panelType }]);
    dispatch(tr);
  }

  removePanel(view: EditorView) {
    const { dispatch, state } = view;
    let { tr } = state;
    let { $from, $to } = state.selection;
    let newFrom = tr.doc.resolve($from.start($from.depth - 1));
    let newTo = tr.doc.resolve($to.end($to.depth - 1));
    let range = newFrom.blockRange(newTo)!;
    tr = tr.delete(range!.start - 1, range!.end + 1);
    dispatch(tr);
  }

  subscribe(cb: PanelStateSubscriber) {
    this.changeHandlers.push(cb);
    cb(this);
  }

  unsubscribe(cb: PanelStateSubscriber) {
    this.changeHandlers = this.changeHandlers.filter(ch => ch !== cb);
  }

  // TODO: Fix types (ED-2987)
  update(state: EditorState, docView: any, domEvent: boolean = false) {
    this.state = state;
    const newPanel = this.getActivePanel(docView);
    if ((domEvent && newPanel) || this.activeNode !== newPanel) {
      const newElement = newPanel && this.getDomElement(docView);
      this.activeNode = newPanel;
      this.toolbarVisible =
        this.editorFocused &&
        !!newPanel &&
        (domEvent || this.element !== newElement);
      this.element = newElement;
      this.activePanelType = newPanel && newPanel.attrs['panelType'];
      this.changeHandlers.forEach(cb => cb(this));
    }
  }

  private getActivePanel(docView: any): Node | undefined {
    const { state } = this;
    if (state.selection instanceof TextSelection) {
      const { $from } = state.selection;
      for (let i = $from.depth; i >= 1; i--) {
        const node = $from.node(i);
        if (node && node.type === state.schema.nodes.panel) {
          return node;
        }
      }
    }
  }

  private getDomElement(docView: any): HTMLElement | undefined {
    const { state: { selection } } = this;
    if (selection instanceof TextSelection) {
      const { node } = docView.domFromPos(selection.$from.pos);
      let currentNode = node;
      while (currentNode) {
        if (
          currentNode.attributes &&
          currentNode.attributes['data-panel-type']
        ) {
          return currentNode as HTMLElement;
        }
        currentNode = currentNode.parentNode!;
      }
    }
  }
}

export type PanelStateSubscriber = (state: PanelState) => any;

export const stateKey = new PluginKey('panelPlugin');

// TODO: Fix types (ED-2987)
export const createPlugin = () =>
  new Plugin({
    state: {
      init(config, state: EditorState) {
        return new PanelState(state);
      },
      apply(tr, pluginState: PanelState, oldState, newState) {
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
      nodeViews: {
        panel: panelNodeView,
      },
      handleClick(view: EditorView & { docView?: any }, event) {
        stateKey.getState(view.state).update(view.state, view.docView, true);
        return false;
      },
      handleDOMEvents: {
        focus(view, event) {
          stateKey.getState(view.state).updateEditorFocused(true);
          return false;
        },
        blur(view: EditorView & { docView?: any }, event) {
          const pluginState = stateKey.getState(view.state);
          pluginState.updateEditorFocused(false);
          pluginState.update(view.state, view.docView, true);
          return false;
        },
      },
    },
  });

const plugins = (schema: Schema) => {
  return [createPlugin()].filter(plugin => !!plugin) as Plugin[];
};

export default plugins;
