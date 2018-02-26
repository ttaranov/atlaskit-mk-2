import { Node } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  getEditorValueWithMedia,
  insertFileFromDataUrl,
  preprocessDoc,
} from '../utils';
import { toJSON } from '../../utils';
import { processRawValue } from '../utils/document';
import { Transformer } from '@atlaskit/editor-common';

export default class EditorActions {
  private editorView?: EditorView;
  private contentTransformer?: Transformer<any>;

  // This method needs to be public for context based helper components.
  _privateGetEditorView(): EditorView | undefined {
    return this.editorView;
  }

  // This method needs to be public for EditorContext component.
  _privateRegisterEditor(
    editorView: EditorView,
    contentTransformer?: Transformer<any>,
  ): void {
    if (!this.editorView && editorView) {
      this.editorView = editorView;
    } else if (this.editorView !== editorView) {
      throw new Error(
        "Editor has already been registered! It's not allowed to re-register editor with the new Editor instance.",
      );
    }
    this.contentTransformer = contentTransformer;
  }

  // This method needs to be public for EditorContext component.
  _privateUnregisterEditor(): void {
    this.editorView = undefined;
  }

  focus(): boolean {
    if (!this.editorView || this.editorView.hasFocus()) {
      return false;
    }

    this.editorView.focus();
    return true;
  }

  blur(): boolean {
    if (!this.editorView || !this.editorView.hasFocus()) {
      return false;
    }

    (this.editorView.dom as HTMLElement).blur();
    return true;
  }

  clear(): boolean {
    if (!this.editorView) {
      return false;
    }

    const editorView = this.editorView;
    const { state } = editorView;
    const tr = editorView.state.tr
      .setSelection(TextSelection.create(state.doc, 0, state.doc.nodeSize - 2))
      .deleteSelection();

    editorView.dispatch(tr);

    return true;
  }

  getValue(): Promise<any | undefined> {
    return getEditorValueWithMedia(this.editorView).then(doc => {
      const processedDoc = preprocessDoc(this.editorView!.state.schema, doc);
      if (this.contentTransformer && processedDoc) {
        return this.contentTransformer.encode(processedDoc);
      }
      return processedDoc ? toJSON(processedDoc) : processedDoc;
    });
  }

  replaceDocument(rawValue: any): boolean {
    if (!this.editorView || rawValue === undefined || rawValue === null) {
      return false;
    }

    const { state } = this.editorView;
    const { schema } = state;

    const transformedDoc = this.contentTransformer
      ? this.contentTransformer.parse(rawValue).toJSON()
      : rawValue;

    const content = processRawValue(schema, transformedDoc);

    if (!content) {
      return false;
    }

    const tr = state.tr
      // In case of replacing a whole document, we only need a content of a top level node e.g. document.
      .replaceWith(0, state.doc.nodeSize - 2, content.content)
      .scrollIntoView();

    this.editorView.dispatch(tr);

    return true;
  }

  replaceSelection(rawValue: Node | Object | string): boolean {
    if (!this.editorView) {
      return false;
    }

    const { state } = this.editorView;

    if (!rawValue) {
      const tr = state.tr.deleteSelection().scrollIntoView();
      this.editorView.dispatch(tr);
      return true;
    }

    const { schema } = state;
    const content = processRawValue(schema, rawValue);

    if (!content) {
      return false;
    }

    const tr = state.tr.replaceSelectionWith(content).scrollIntoView();
    this.editorView.dispatch(tr);

    return true;
  }

  appendText(text: string): boolean {
    if (!this.editorView || !text) {
      return false;
    }

    const { state } = this.editorView;
    const lastChild = state.doc.lastChild;

    if (lastChild && lastChild.type !== state.schema.nodes.paragraph) {
      return false;
    }

    const tr = state.tr.insertText(text).scrollIntoView();
    this.editorView.dispatch(tr);

    return true;
  }

  insertFileFromDataUrl(url: string, filename: string): boolean {
    if (!this.editorView) {
      return false;
    }
    insertFileFromDataUrl(this.editorView.state, url, filename);
    return true;
  }
}
