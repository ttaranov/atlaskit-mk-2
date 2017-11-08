import { setBlockType } from 'prosemirror-commands';
import { Node, Schema } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import keymapPlugin from './keymaps';

export type CodeMirrorFocusSubscriber = (uniqueId: string | undefined) => any;
export type CodeBlockStateSubscriber = (state: CodeBlockState) => any;
export type StateChangeHandler = (state: CodeBlockState) => any;

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
      setBlockType(view.state.schema.nodes.codeBlock, { language, uniqueId: this.uniqueId })(view.state, view.dispatch);
      if (this.focusHandlers.length > 0) {
        this.triggerFocus();
      } else {
        view.focus();
      }
    }
  }

  removeCodeBlock(view: EditorView): void {
    const { state, dispatch } = view;
    const { $from, $to } = state.selection;
    const range = $from.blockRange($to);
    dispatch(state.tr.delete(range!.start, range!.end));
    view.focus();
  }


  updateEditorFocused(editorFocused: boolean) {
    this.editorFocused = editorFocused;
  }

  setLanguages(supportedLanguages: string[]) {
    this.supportedLanguages = supportedLanguages;
  }

  // TODO: Fix types (ED-2987)
  update(state: EditorState, docView: EditorView & { docView?: any }, domEvent: boolean = false) {
    this.state = state;
    const codeBlockNode = this.activeCodeBlockNode();
    if (domEvent && codeBlockNode || codeBlockNode !== this.activeCodeBlock) {
      this.domEvent = domEvent;
      const newElement = codeBlockNode && this.activeCodeBlockElement(docView);

      this.toolbarVisible = this.editorFocused && !!codeBlockNode && (domEvent || this.element !== newElement);
      this.activeCodeBlock = codeBlockNode;
      this.language = codeBlockNode && codeBlockNode.attrs['language'] || undefined;
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

  // TODO: Fix types (ED-2987)
  private activeCodeBlockElement(docView: any): HTMLElement {
    const offset = this.nodeStartPos();
    const { node } = docView.domFromPos(offset);

    return node as HTMLElement;
  }

  private nodeStartPos(): number {
    const { $from } = this.state.selection;
    return $from.start($from.depth);
  }

  private activeCodeBlockNode(): Node | undefined {
    const { state } = this;
    const { $from } = state.selection;
    const node = $from.parent;
    if (node.type === state.schema.nodes.codeBlock) {
      return node;
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
        pluginState.update(newState, stored.docView, stored.domEvent);
      }
      return pluginState;
    }
  },
  key: stateKey,
  // TODO: Fix types (ED-2987)
  view: (editorView: EditorView & { docView?: any }) => {
    stateKey.getState(editorView.state).update(editorView.state, editorView.docView);
    return {
      update: (view: EditorView & { docView?: any }, prevState: EditorState) => {
        stateKey.getState(view.state).update(view.state, view.docView);
      }
    };
  },
  props: {
    handleClick(view: EditorView & { docView?: any }, event) {
      stateKey.getState(view.state).update(view.state, view.docView, true);
      return false;
    },
    onFocus(view: EditorView, event) {
      stateKey.getState(view.state).updateEditorFocused(true);
    },
    onBlur(view: EditorView & { docView?: any }, event) {
      const pluginState = stateKey.getState(view.state);
      pluginState.updateEditorFocused(false);
      pluginState.update(view.state, view.docView, true);
    },
  }
});

const plugins = (schema: Schema) => {
  return [plugin, keymapPlugin(schema)].filter((plugin) => !!plugin) as Plugin[];
};

export default plugins;
