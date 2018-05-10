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

export interface State {
  emojiPickerOpen: boolean;
}

export default class EmojiPicker extends React.Component<Props, State> {
  state: State = {
    emojiPickerOpen: false,
  };

  componentWillReceiveProps(nextProps: Props) {
    const { clickedCell } = nextProps;
    // If number of visible buttons changed, close emoji picker
    if (clickedCell && clickedCell !== this.props.clickedCell) {
      this.setState({ emojiPickerOpen: true });
    }
  }

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

    if (!targetRef || !this.state.emojiPickerOpen) {
      return null;
    }

    return (
      <PopupWithListeners
        target={targetRef!}
        offset={[0, 2]}
        handleClickOutside={this.handleClickOutside}
        handleEscapeKeydown={onClickOutside}
      >
        <AkEmojiPicker emojiProvider={emojiProvider} onSelection={onSelect} />
      </PopupWithListeners>
    );
  }

  private handleClickOutside = e => {
    this.props.onClickOutside(e);
    this.setState({ emojiPickerOpen: false });
  };
}
