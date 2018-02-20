import * as React from 'react';
import { EditorView } from 'prosemirror-view';

import { Editor, mentionPluginKey, MentionsState } from '@atlaskit/editor-core';
import { MentionProvider, MentionDescription } from '@atlaskit/mention';
import NativeToWebBridge from './native-to-web-bridge';
import { MentionBridge } from './web-to-native-bridge';

/**
 * In order to enable mentions in Editor we must set both properties: allowMentions and mentionProvider.
 * So this type is supposed to be a stub version of mention provider. We don't actually need it.
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

class EditorWithState extends Editor {
  componentDidUpdate(prevProps, prevState) {
    const { editor } = this.state;
    super.componentDidUpdate(prevProps, prevState);
    if (!prevState.editor && editor) {
      mentionsPluginState = mentionPluginKey.getState(editor.editorView.state);
      if (mentionsPluginState) {
        mentionsPluginState.subscribe(state => {
          if (state.queryActive) {
            toNativeBridge.showMentions(state.query || '');
          } else {
            toNativeBridge.dismissMentions();
          }
        });
      }
      let editorView: EditorView = editor.editorView;
      editorView.dom.addEventListener('keydown', event => {
        // console.log(event)
      });
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
    webkit?: any;
  }
}

class Bridge implements MentionBridge {
  mentionBridge: MentionBridge;

  constructor() {
    if (window.mentionsBridge) {
      this.mentionBridge = new AndroidBridge();
    } else if (window.webkit) {
      this.mentionBridge = new IosBridge();
    } else {
      this.mentionBridge = new DummyBridge();
    }
  }

  showMentions(query: String) {
    this.mentionBridge.showMentions(query);
  }

  dismissMentions() {
    this.mentionBridge.dismissMentions();
  }
}

class AndroidBridge implements MentionBridge {
  mentionBridge: MentionBridge;
  constructor() {
    this.mentionBridge = window.mentionsBridge as MentionBridge;
  }

  showMentions(query: String) {
    this.mentionBridge.showMentions(query);
  }

  dismissMentions() {
    this.mentionBridge.dismissMentions();
  }
}

class IosBridge implements MentionBridge {
  showMentions(query: String) {
    if (window.webkit) {
      window.webkit.mentionBridge.postMessage({
        name: 'showMentions',
        query: query,
      });
    }
  }

  dismissMentions() {
    if (window.webkit) {
      window.webkit.mentionBridge.postMessage({ name: 'dismissMentions' });
    }
  }
}

class DummyBridge implements MentionBridge {
  showMentions(query: String) {}

  dismissMentions() {}
}

const toNativeBridge: Bridge = new Bridge();
