import NativeToWebBridge from './bridge';

import { EditorView } from 'prosemirror-view';

import {
  MentionsState,
  TextFormattingState,
  MobilePicker,
} from '@atlaskit/editor-core';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { MentionDescription } from '@atlaskit/mention';

export default class WebBridgeImpl implements NativeToWebBridge {
  textFormattingPluginState: TextFormattingState | null = null;
  mentionsPluginState: MentionsState | null = null;
  editorView: EditorView | null = null;
  transformer: JSONTransformer = new JSONTransformer();
  mediaPicker: MobilePicker | undefined;

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
  setContent(content: string) {}

  getContent(): string {
    return this.editorView
      ? JSON.stringify(
          this.transformer.encode(this.editorView.state.doc),
          null,
          2,
        )
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
}
