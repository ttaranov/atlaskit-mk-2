import { setBlockType } from 'prosemirror-commands';
import { Node, Schema } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  findParentDomRefOfType,
  findParentNodeOfType,
  removeParentNodeOfType,
} from 'prosemirror-utils';
import keymapPlugin from './keymaps';
import codeBlockNodeView from '../nodeviews/code-block';

export type CodeMirrorFocusSubscriber = (uniqueId: string | undefined) => any;
export type CodeBlockStateSubscriber = (state: CodeBlockState) => any;
export type StateChangeHandler = (state: CodeBlockState) => any;
export type DomAtPos = (pos: number) => { node: HTMLElement; offset: number };

export class CodeBlockState {
  element?: HTMLElement;
  language: string | undefined;
  supportedLanguages: string[];
  toolbarVisible: boolean = false;
  domEvent: boolean = false;
  uniqueId: string | undefined = undefined;
  activeCodeBlock?: Node;
  editorFocused: boolean = false;

  private state: EditorState;
  private changeHandlers: CodeBlockStateSubscriber[] = [];
  private focusHandlers: CodeMirrorFocusSubscriber[] = [];

  constructor(state: EditorState) {
    this.changeHandlers = [];
    this.focusHandlers = [];
    this.state = state;
  }

  subscribe(cb: CodeBlockStateSubscriber) {
    this.changeHandlers.push(cb);
    cb(this);
  }

  unsubscribe(cb: CodeBlockStateSubscriber) {
    this.changeHandlers = this.changeHandlers.filter(ch => ch !== cb);
  }

  subscribeFocusHandlers(cb: CodeMirrorFocusSubscriber) {
    this.focusHandlers.push(cb);
  }

  unsubscribeFocusHandlers(cb: CodeMirrorFocusSubscriber) {
    this.focusHandlers = this.focusHandlers.filter(ch => ch !== cb);
  }

  updateLanguage(language: string | undefined, view: EditorView): void {
    if (this.activeCodeBlock) {
      setBlockType(view.state.schema.nodes.codeBlock, {
        language,
        uniqueId: this.uniqueId,
      })(view.state, view.dispatch);
      if (this.focusHandlers.length > 0) {
        this.triggerFocus();
      } else {
        view.focus();
      }
    }
  }

  removeCodeBlock(view: EditorView): void {
    const {
      state: { tr, schema },
      dispatch,
    } = view;
    dispatch(removeParentNodeOfType(schema.nodes.codeBlock)(tr));
    view.focus();
  }

  updateEditorFocused(editorFocused: boolean) {
    this.editorFocused = editorFocused;
  }

  setLanguages(supportedLanguages: string[]) {
    this.supportedLanguages = supportedLanguages;
  }

  update(state: EditorState, domAtPos: DomAtPos, domEvent: boolean = false) {
    this.state = state;
    const codeBlockNode = this.activeCodeBlockNode();
    if ((domEvent && codeBlockNode) || codeBlockNode !== this.activeCodeBlock) {
      this.domEvent = domEvent;
      const newElement = codeBlockNode && this.activeCodeBlockElement(domAtPos);

      this.toolbarVisible =
        this.editorFocused &&
        !!codeBlockNode &&
        (domEvent || this.element !== newElement);
      this.activeCodeBlock = codeBlockNode;
      this.language =
        (codeBlockNode && codeBlockNode.attrs['language']) || undefined;
      this.element = newElement;
      this.uniqueId = codeBlockNode && codeBlockNode!.attrs['uniqueId'];
      this.triggerOnChange();
    }
  }

  private triggerOnChange() {
    this.changeHandlers.forEach(cb => cb(this));
  }

  private triggerFocus() {
    this.focusHandlers.forEach(cb => cb(this.uniqueId));
  }

  private activeCodeBlockElement(domAtPos: DomAtPos): HTMLElement | undefined {
    const {
      selection,
      schema: {
        nodes: { codeBlock },
      },
    } = this.state;
    const codeDOM = findParentDomRefOfType(codeBlock, domAtPos)(
      selection,
    ) as HTMLElement;
    return codeDOM
      ? codeDOM.parentElement!.parentElement!.parentElement!
      : undefined;
  }

  private activeCodeBlockNode(): Node | undefined {
    const {
      selection,
      schema: {
        nodes: { codeBlock },
      },
    } = this.state;
    const parent = findParentNodeOfType(codeBlock)(selection);
    if (parent) {
      return parent.node;
    }
  }
}
export const stateKey = new PluginKey('codeBlockPlugin');

export const plugin = new Plugin({
  state: {
    init(config, state: EditorState) {
      return new CodeBlockState(state);
    },
    apply(tr, pluginState: CodeBlockState, oldState, newState) {
      const stored = tr.getMeta(stateKey);
      if (stored) {
        pluginState.update(newState, stored.domAtPos, stored.domEvent);
      }
      return pluginState;
    },
  },
  key: stateKey,
  view: (editorView: EditorView) => {
    const domAtPos = editorView.domAtPos.bind(editorView);
    stateKey.getState(editorView.state).update(editorView.state, domAtPos);
    return {
      update: (view: EditorView, prevState: EditorState) => {
        stateKey.getState(view.state).update(view.state, domAtPos);
      },
    };
  },
  props: {
    nodeViews: {
      codeBlock: codeBlockNodeView,
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

const plugins = (schema: Schema) => {
  return [plugin, keymapPlugin(schema)].filter(plugin => !!plugin) as Plugin[];
};

export default plugins;
