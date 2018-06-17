import { Node } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  setParentNodeMarkup,
  findParentDomRefOfType,
  findParentNodeOfType,
  removeParentNodeOfType,
} from 'prosemirror-utils';
import { analyticsService } from '../../../analytics';
import { panelNodeView } from '../nodeviews/panel';

export type DomAtPos = (pos: number) => { node: HTMLElement; offset: number };

export interface PanelType {
  panelType: 'info' | 'note' | 'success' | 'warning' | 'error';
}

export const availablePanelType = [
  { panelType: 'info' },
  { panelType: 'note' },
  { panelType: 'success' },
  { panelType: 'warning' },
  { panelType: 'error' },
];

export class PanelState {
  private state: EditorState;
  private activeNode: Node | undefined;
  private changeHandlers: PanelStateSubscriber[] = [];

  element?: HTMLElement;
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

  changePanelType(view: EditorView, { panelType }: PanelType) {
    analyticsService.trackEvent(`atlassian.editor.format.${panelType}.button`);
    const {
      state: { tr, schema },
      dispatch,
    } = view;
    dispatch(setParentNodeMarkup(schema.nodes.panel, null, { panelType })(tr));
  }

  removePanel(view: EditorView) {
    const {
      state: { tr, schema },
      dispatch,
    } = view;
    dispatch(removeParentNodeOfType(schema.nodes.panel)(tr));
  }

  subscribe(cb: PanelStateSubscriber) {
    this.changeHandlers.push(cb);
    cb(this);
  }

  unsubscribe(cb: PanelStateSubscriber) {
    this.changeHandlers = this.changeHandlers.filter(ch => ch !== cb);
  }

  update(state: EditorState, domAtPos: DomAtPos, domEvent: boolean = false) {
    this.state = state;
    const newPanel = this.getActivePanel();
    if ((domEvent && newPanel) || this.activeNode !== newPanel) {
      const newElement = newPanel && this.getDomElement(domAtPos);
      this.activeNode = newPanel;
      this.toolbarVisible =
        this.editorFocused &&
        !!newPanel &&
        (domEvent || this.element !== newElement);
      this.element = newElement || undefined;
      this.activePanelType = newPanel && newPanel.attrs['panelType'];
      this.changeHandlers.forEach(cb => cb(this));
    }
  }

  private getActivePanel(): Node | undefined {
    const {
      state: {
        selection,
        schema: {
          nodes: { panel },
        },
      },
    } = this;
    const parent = findParentNodeOfType(panel)(selection);
    if (parent) {
      return parent.node;
    }
  }

  private getDomElement(domAtPos: DomAtPos): HTMLElement | null {
    const {
      state: {
        selection,
        schema: {
          nodes: { panel },
        },
      },
    } = this;
    return findParentDomRefOfType(panel, domAtPos)(
      selection,
    ) as HTMLElement | null;
  }
}

export type PanelStateSubscriber = (state: PanelState) => any;

export const stateKey = new PluginKey('panelPlugin');

// TODO: Fix types (ED-2987)
export const createPlugin = ({ portalProviderAPI }) =>
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
        update: (view: EditorView, prevState: EditorState) => {
          stateKey
            .getState(view.state)
            .update(view.state, view.domAtPos.bind(view));
        },
      };
    },
    props: {
      nodeViews: {
        panel: panelNodeView(portalProviderAPI),
      },
      handleClick(view: EditorView, event) {
        stateKey
          .getState(view.state)
          .update(view.state, view.domAtPos.bind(view), true);
        return false;
      },
      handleDOMEvents: {
        focus(view, event) {
          stateKey.getState(view.state).updateEditorFocused(true);
          return false;
        },
        blur(view: EditorView, event) {
          const pluginState = stateKey.getState(view.state);
          pluginState.updateEditorFocused(false);
          pluginState.update(view.state, view.domAtPos.bind(view), true);
          return false;
        },
      },
    },
  });
