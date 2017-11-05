import { EmojiTypeAhead as AkEmojiTypeAhead } from '@atlaskit/emoji';
import * as React from 'react';
import { PureComponent } from 'react';
import { EmojiProvider } from '@atlaskit/emoji';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import Popup from '../Popup';
import { EmojiState } from '../../plugins/emojis';

export interface Props {
  editorView?: EditorView;
  pluginKey: PluginKey;
  reversePosition?: boolean;
  popupsBoundariesElement?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  emojiProvider: Promise<EmojiProvider>;
}

export interface State {
  query?: string;
  anchorElement?: HTMLElement;
  queryActive?: boolean;
}

export default class EmojiTypeAhead extends PureComponent<Props, State> {
  private pluginState?: EmojiState;
  state: State = {};
  typeAhead?: AkEmojiTypeAhead;

  componentWillMount() {
    this.setPluginState(this.props);
  }

  componentWillUpdate(nextProps: Props) {
    if (!this.pluginState) {
      this.setPluginState(nextProps);
    }
  }

  componentWillUnmount() {
    const { pluginState } = this;

    if (pluginState) {
      pluginState.unsubscribe(this.handlePluginStateChange);
    }
  }

  private setPluginState(props: Props) {
    const { editorView, pluginKey } = props;

    if (!editorView) {
      return;
    }

    const pluginState = pluginKey.getState(editorView.state);

    if (pluginState) {
      this.pluginState = pluginState;

      pluginState.subscribe(this.handlePluginStateChange);
      pluginState.onSelectPrevious = this.handleSelectPrevious;
      pluginState.onSelectNext = this.handleSelectNext;
      pluginState.onSelectCurrent = this.handleSelectCurrent;
    }
  }

  private handlePluginStateChange = (state: EmojiState) => {
    const { anchorElement, query, queryActive } = state;
    this.setState({ anchorElement, query, queryActive });
  }

  private handleEmojiTypeAheadRef = (ref) => {
    this.typeAhead = ref;
  }

  render() {
    const { anchorElement, query, queryActive } = this.state;
    const { popupsBoundariesElement, popupsMountPoint, emojiProvider } = this.props;

    if (!this.pluginState || !anchorElement || !queryActive || !emojiProvider) {
      return null;
    }

    return (
      <Popup
        target={anchorElement}
        fitHeight={350}
        fitWidth={350}
        boundariesElement={popupsBoundariesElement}
        mountTo={popupsMountPoint}
        offset={[0, 3]}
      >
        <AkEmojiTypeAhead
          emojiProvider={emojiProvider}
          onSelection={this.handleSelectedEmoji}
          query={query}
          ref={this.handleEmojiTypeAheadRef}
        />
      </Popup>
    );
  }

  private handleSelectedEmoji = (emojiId: any, emoji: any) => {
    this.pluginState!.insertEmoji(emojiId);
  }

  private handleSelectPrevious = (): boolean => {
    if (this.typeAhead) {
      (this.typeAhead as AkEmojiTypeAhead).selectPrevious();
    }

    return true;
  }

  private handleSelectNext = (): boolean => {
    if (this.typeAhead) {
      (this.typeAhead as AkEmojiTypeAhead).selectNext();
    }

    return true;
  }

  private handleSelectCurrent = (): boolean => {
    if (this.getEmojisCount() > 0) {
      (this.typeAhead as AkEmojiTypeAhead).chooseCurrentSelection();
    } else {
      this.pluginState!.dismiss();
    }

    return true;
  }

  private getEmojisCount(): number {
    return (this.typeAhead && this.typeAhead.count()) || 0;
  }
}
