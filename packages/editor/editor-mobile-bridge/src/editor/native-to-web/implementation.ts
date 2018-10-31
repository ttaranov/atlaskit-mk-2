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
  toggleSuperscript,
  toggleSubscript,
  toggleStrike,
  toggleCode,
  toggleUnderline,
  toggleEm,
  toggleStrong,
} from '@atlaskit/editor-core';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { MentionDescription } from '@atlaskit/mention';
import { rejectPromise, resolvePromise } from '../../cross-platform-promise';
import { setBlockType } from '../../../../editor-core/src/plugins/block-type/commands';

export default class WebBridgeImpl implements NativeToWebBridge {
  textFormattingPluginState: TextFormattingState | null = null;
  mentionsPluginState: MentionsState | null = null;
  editorView: EditorView | null = null;
  transformer: JSONTransformer = new JSONTransformer();
  editorActions: EditorActions = new EditorActions();
  mediaPicker: CustomMediaPicker | undefined;
  blockState: BlockTypeState | undefined;
  listState: ListsState | undefined;
  mediaMap: Map<string, Function> = new Map();

  onBoldClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      toggleStrong()(this.editorView.state, this.editorView.dispatch);
    }
  }

  onItalicClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      toggleEm()(this.editorView.state, this.editorView.dispatch);
    }
  }

  onUnderlineClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      toggleUnderline()(this.editorView.state, this.editorView.dispatch);
    }
  }
  onCodeClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      toggleCode()(this.editorView.state, this.editorView.dispatch);
    }
  }
  onStrikeClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      toggleStrike()(this.editorView.state, this.editorView.dispatch);
    }
  }
  onSuperClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      toggleSuperscript()(this.editorView.state, this.editorView.dispatch);
    }
  }
  onSubClicked() {
    if (this.textFormattingPluginState && this.editorView) {
      toggleSubscript()(this.editorView.state, this.editorView.dispatch);
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
      this.editorActions.replaceDocument(content, false);
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
  onMediaPicked(eventName: string, mediaPayload: string) {
    if (this.mediaPicker) {
      const payload = JSON.parse(mediaPayload);

      switch (eventName) {
        case 'upload-preview-update': {
          const uploadPromise = new Promise(resolve => {
            this.mediaMap.set(payload.file.id, resolve);
          });
          payload.file.upfrontId = uploadPromise;
          payload.preview = {
            dimensions: payload.file.dimensions,
          };
          this.mediaPicker.emit(eventName, payload);

          return;
        }
        case 'upload-end': {
          const getUploadPromise = this.mediaMap.get(payload.file.id);
          if (getUploadPromise) {
            getUploadPromise!(payload.file.publicId);
          }
          return;
        }
      }
    }
  }
  onPromiseResolved(uuid: string, payload: string) {
    resolvePromise(uuid, JSON.parse(payload));
  }

  onPromiseRejected(uuid: string) {
    rejectPromise(uuid);
  }

  onBlockSelected(blockType: string) {
    if (this.editorView) {
      const { state, dispatch } = this.editorView;
      setBlockType(blockType)(state, dispatch);
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
