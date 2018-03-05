import * as React from 'react';
import { EditorView } from 'prosemirror-view';

import {
  Editor,
  mentionPluginKey,
  MentionsState,
  TextFormattingState,
  textFormattingStateKey,
} from '@atlaskit/editor-core';
import { MentionProvider, MentionDescription } from '@atlaskit/mention';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import NativeToWebBridge from './native-to-web-bridge';
import {
  MarkState,
  MentionBridge,
  TextFormattingBridge,
} from './web-to-native-bridge';

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

let textFormattingPluginState: TextFormattingState | null = null;
let editorView: EditorView | null = null;
let transformer: JSONTransformer = new JSONTransformer();

export const bridge: NativeToWebBridge = ((window as any).bridge = {
  onBoldClicked() {
    if (textFormattingPluginState && editorView) {
      textFormattingPluginState.toggleStrong(editorView);
    }
  },

  onItalicClicked() {
    if (textFormattingPluginState && editorView) {
      textFormattingPluginState.toggleEm(editorView);
    }
  },

  onUnderlineClicked() {
    if (textFormattingPluginState && editorView) {
      textFormattingPluginState.toggleUnderline(editorView);
    }
  },
  onCodeClicked() {
    if (textFormattingPluginState && editorView) {
      textFormattingPluginState.toggleCode(editorView);
    }
  },
  onStrikeClicked() {
    if (textFormattingPluginState && editorView) {
      textFormattingPluginState.toggleStrike(editorView);
    }
  },
  onSuperClicked() {
    if (textFormattingPluginState && editorView) {
      textFormattingPluginState.toggleSuperscript(editorView);
    }
  },
  onSubClicked() {
    if (textFormattingPluginState && editorView) {
      textFormattingPluginState.toggleSubscript(editorView);
    }
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
  setContent(content: string) {},
  getContent(): string {
    return editorView
      ? JSON.stringify(transformer.encode(editorView.state.doc), null, 2)
      : '';
  },
});

class EditorWithState extends Editor {
  componentDidUpdate(prevProps, prevState) {
    const { editor } = this.state;
    super.componentDidUpdate(prevProps, prevState);
    if (!prevState.editor && editor) {
      editorView = editor.editorView;
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
      editorView.dom.addEventListener('keydown', event => {
        console.log(event);
      });

      textFormattingPluginState = textFormattingStateKey.getState(
        editor.editorView.state,
      );
      if (textFormattingPluginState) {
        textFormattingPluginState.subscribe(state => {
          let states: MarkState[] = [
            {
              markName: 'strong',
              active: state.strongActive,
              enabled: !state.strongDisabled,
            },
            {
              markName: 'em',
              active: state.emActive,
              enabled: !state.emDisabled,
            },
            {
              markName: 'code',
              active: state.codeActive,
              enabled: !state.codeDisabled,
            },
            {
              markName: 'underline',
              active: state.underlineActive,
              enabled: !state.underlineDisabled,
            },
            {
              markName: 'strike',
              active: state.strikeActive,
              enabled: !state.strongDisabled,
            },
            {
              markName: 'subsup',
              active: state.subscriptActive || state.superscriptActive,
              enabled: !state.subscriptDisabled && !state.superscriptDisabled,
            },
          ];
          toNativeBridge.updateTextFormat(JSON.stringify(states));
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
      onChange={() => {
        toNativeBridge.updateText(bridge.getContent());
      }}
    />
  );
}

declare global {
  interface Window {
    mentionsBridge?: MentionBridge;
    textFormatBridge?: TextFormattingBridge;
    webkit?: any;
  }
}

interface Bridge extends MentionBridge, TextFormattingBridge {}

class AndroidBridge implements Bridge {
  mentionBridge: MentionBridge;
  textFormatBridge: TextFormattingBridge;

  constructor() {
    this.mentionBridge = window.mentionsBridge as MentionBridge;
    this.textFormatBridge = window.textFormatBridge as TextFormattingBridge;
  }

  showMentions(query: String) {
    this.mentionBridge.showMentions(query);
  }

  dismissMentions() {
    this.mentionBridge.dismissMentions();
  }

  updateTextFormat(markStates: string) {
    this.textFormatBridge.updateTextFormat(markStates);
  }

  updateText(content: string) {
    this.textFormatBridge.updateText(content);
  }
}

class IosBridge implements Bridge {
  showMentions(query: String) {
    if (window.webkit && window.webkit.messageHandlers.mentionBridge) {
      window.webkit.messageHandlers.mentionBridge.postMessage({
        name: 'showMentions',
        query: query,
      });
    }
  }

  dismissMentions() {
    if (window.webkit) {
      window.webkit.messageHandlers.mentionBridge.postMessage({
        name: 'dismissMentions',
      });
    }
  }
  updateTextFormat(markStates: string) {
    if (window.webkit) {
      window.webkit.messageHandlers.textFormatBridge.postMessage({
        name: 'updateTextFormat',
        states: markStates,
      });
    }
  }
  updateText(content: string) {
    if (window.webkit && window.webkit.messageHandlers.mentionBridge) {
      window.webkit.messageHandlers.textFormatBridge.postMessage({
        name: 'updateText',
        query: content,
      });
    }
  }
}

class DummyBridge implements Bridge {
  showMentions(query: String) {}
  dismissMentions() {}
  updateTextFormat(markStates: string) {}
  updateText(content: string) {}
}

function getBridgeImpl(): Bridge {
  if (window.mentionsBridge) {
    return new AndroidBridge();
  } else if (window.webkit) {
    return new IosBridge();
  } else {
    return new DummyBridge();
  }
}

const toNativeBridge: Bridge = getBridgeImpl();
