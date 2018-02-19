import * as React from 'react';

import { Editor, mentionPluginKey, MentionsState } from '@atlaskit/editor-core';
import { MentionProvider, MentionDescription } from '@atlaskit/mention';
import NativeToWebBridge from './native-to-web-bridge';

/**
 * In order to enable mentions in Editor we must set both properties: allowMentions and mentionProvider.
 * So this type is supposed to be a stub version of mention provider. We don't actually need it.
 * TODO consider to move this helper class to somewhere outside example
 */
export class MentionProviderImpl implements MentionProvider {
  filter(query?: string): void {}
  recordMentionSelection(mention: MentionDescription): void {}
  shouldHighlightMention(mention: MentionDescription): boolean {
    return false;
  }
  isFiltering(query: string): boolean {
    return false;
  }
  subscribe(
    key: string,
    callback?,
    errCallback?,
    infoCallback?,
    allResultsCallback?,
  ): void {}
  unsubscribe(key: string): void {}
}

let mentionsPluginState: MentionsState | null = null;

export const bridge: NativeToWebBridge = ((window as any).bridge = {
  makeBold() {
    throw new Error('Method not implemented.');
  },

  makeItalics() {
    throw new Error('Method not implemented.');
  },

  onMentionSelect(mention: string) {
    if (mentionsPluginState) {
      mentionsPluginState.insertMention(JSON.parse(mention));
    }
  },

  onMentionPickerResult(result: string) {
    if (mentionsPluginState) {
      let all: MentionDescription[] = JSON.parse(result);
      mentionsPluginState.onMentionResult(
        all,
        mentionsPluginState.query ? mentionsPluginState.query : '',
      );
    }
  },

  onMentionPickerDismissed() {
    if (mentionsPluginState) {
      mentionsPluginState.dismiss();
    }
  },
});

export class EditorWithState extends Editor {
  componentDidUpdate(prevProps, prevState) {
    const { editor } = this.state;
    super.componentDidUpdate(prevProps, prevState);
    if (editor) {
      mentionsPluginState = mentionPluginKey.getState(editor.editorView.state);
      if (mentionsPluginState) {
        mentionsPluginState.subscribe(state => {
          const { mentionsBridge } = window;
          if (mentionsBridge) {
            if (state.queryActive) {
              mentionsBridge.showMentions(state.query || '');
            } else {
              mentionsBridge.dismissMentions();
            }
          }
        });
      }
    }
  }
}

export default function mobileEditor() {
  return (
    <EditorWithState
      appearance="mobile"
      allowHyperlinks={true}
      allowTextFormatting={true}
      mentionProvider={Promise.resolve(new MentionProviderImpl())}
    />
  );
}

declare global {
  interface Window {
    mentionsBridge?: MentionBridge;
  }
}

export interface MentionBridge {
  showMentions(query: String);
  dismissMentions();
}
