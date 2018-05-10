import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { Popup } from '@atlaskit/editor-common';
import { findDomRefAtPos } from 'prosemirror-utils';
import {
  EmojiId,
  EmojiDescription,
  EmojiPicker as AkEmojiPicker,
  EmojiProvider,
} from '@atlaskit/emoji';
import withOuterListeners from '../../../../ui/with-outer-listeners';

const PopupWithListeners = withOuterListeners(Popup);

export interface Props {
  editorView: EditorView;
  clickedCell?: { pos: number; node: PMNode };
  onClickOutside: (event: Event) => void;
  onSelect: (emojiId: EmojiId, emoji: EmojiDescription, event) => void;
  emojiProvider: Promise<EmojiProvider>;
}

export default class EmojiPicker extends React.Component<Props, any> {
  render() {
    const {
      clickedCell,
      emojiProvider,
      onClickOutside,
      onSelect,
      editorView,
    } = this.props;
    let targetRef;
    if (
      clickedCell &&
      clickedCell.node &&
      clickedCell.node.attrs.cellType === 'emoji'
    ) {
      targetRef = findDomRefAtPos(
        clickedCell.pos,
        editorView.domAtPos.bind(editorView),
      );
    }

    if (!targetRef) {
      return null;
    }

    return (
      <PopupWithListeners
        target={targetRef!}
        offset={[0, 2]}
        handleClickOutside={onClickOutside}
        handleEscapeKeydown={onClickOutside}
      >
        <AkEmojiPicker emojiProvider={emojiProvider} onSelection={onSelect} />
      </PopupWithListeners>
    );
  }
}
