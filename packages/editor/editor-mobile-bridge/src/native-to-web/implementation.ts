import NativeToWebBridge from './bridge';

import { EditorView } from 'prosemirror-view';

import {
  MentionsState,
  TextFormattingState,
  EditorActions,
  CustomMediaPicker,
  BlockTypeState,
  ListsState,
  indentList,
  outdentList,
  toggleOrderedList,
  toggleBulletList,
} from '@atlaskit/editor-core';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { MentionDescription } from '@atlaskit/mention';
import { rejectPromise, resolvePromise } from '../cross-platform-promise';
import { setBlockType } from '../../../editor-core/src/commands';

export default class WebBridgeImpl implements NativeToWebBridge {
  textFormattingPluginState: TextFormattingState | null = null;
  mentionsPluginState: MentionsState | null = null;
  editorView: EditorView | null = null;
  transformer: JSONTransformer = new JSONTransformer();
  editorActions: EditorActions = new EditorActions();
  mediaPicker: CustomMediaPicker | undefined;
  blockState: BlockTypeState | undefined;
  listState: ListsState | undefined;

  onBoldClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      this.textFormattingPluginState.toggleStrong(this.editorView);
    }
  }

  onItalicClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      this.textFormattingPluginState.toggleEm(this.editorView);
    }
  }

  onUnderlineClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      this.textFormattingPluginState.toggleUnderline(this.editorView);
    }
  }
  onCodeClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      this.textFormattingPluginState.toggleCode(this.editorView);
    }
  }
  onStrikeClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      this.textFormattingPluginState.toggleStrike(this.editorView);
    }
  }
  onSuperClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      this.textFormattingPluginState.toggleSuperscript(this.editorView);
    }
  }
  onSubClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      this.textFormattingPluginState.toggleSubscript(this.editorView);
    }
  }
  onMentionSelect(mention: string) {
    if (this.mentionsPluginState) {
      this.mentionsPluginState.insertMention(JSON.parse(mention));
    }
  }

  onMentionPickerResult(result: string) {
    if (this.mentionsPluginState) {
      let all: MentionDescription[] = JSON.parse(result);
      this.mentionsPluginState.onMentionResult(
        all,
        this.mentionsPluginState.query ? this.mentionsPluginState.query : '',
      );
    }
  }

  onMentionPickerDismissed() {
    if (this.mentionsPluginState) {
      this.mentionsPluginState.dismiss();
    }
  }

  setContent(content: string) {
    if (this.editorActions) {
      this.editorActions.replaceDocument(content);
    }
  }

  getContent(): string {
    return this.editorView
      ? JSON.stringify(this.transformer.encode(this.editorView.state.doc))
      : '';
  }

  setTextFormattingStateAndSubscribe(state: TextFormattingState) {
    this.textFormattingPluginState = state;
  }
  onMediaPicked(eventName: string, payload: string) {
    if (this.mediaPicker) {
      this.mediaPicker.emit(eventName, JSON.parse(payload));
    }
  }
  onPromiseResolved(uuid: string, paylaod: string) {
    resolvePromise(uuid, JSON.parse(paylaod));
  }

  onPromiseRejected(uuid: string) {
    rejectPromise(uuid);
  }

  onBlockSelected(blockType: string) {
    if (this.blockState && this.editorView) {
      setBlockType(this.editorView, blockType);
    }
  }

  onOrderedListSelected() {
    if (this.listState && this.editorView) {
      toggleOrderedList(this.editorView);
    }
  }
  onBulletListSelected() {
    if (this.listState && this.editorView) {
      toggleBulletList(this.editorView);
    }
  }

  onIndentList() {
    if (this.listState && this.editorView) {
      indentList()(this.editorView.state, this.editorView.dispatch);
    }
  }

  onOutdentList() {
    if (this.listState && this.editorView) {
      outdentList()(this.editorView.state, this.editorView.dispatch);
    }
  }
}
