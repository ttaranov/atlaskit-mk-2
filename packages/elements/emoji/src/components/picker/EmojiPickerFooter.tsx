import * as React from 'react';
import { PureComponent } from 'react';
import * as classNames from 'classnames';

import * as styles from './styles';
import EmojiPreview from '../common/EmojiPreview';
import EmojiUploadPicker, { OnUploadEmoji } from '../common/EmojiUploadPicker';
import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
  OnToneSelected,
  ToneSelection,
} from '../../types';
import EmojiDeletePreview, {
  OnDeleteEmoji,
} from '../common/EmojiDeletePreview';

export interface Props {
  selectedEmoji?: EmojiDescription;
  selectedTone?: ToneSelection;
  onToneSelected?: OnToneSelected;
  toneEmoji?: EmojiDescriptionWithVariations;
  uploading: boolean;
  uploadEnabled: boolean;
  emojiToDelete?: EmojiDescription;
  initialUploadName?: string;
  uploadErrorMessage?: string;
  onUploadCancelled: () => void;
  onUploadEmoji: OnUploadEmoji;
  onCloseDelete: () => void;
  onDeleteEmoji: OnDeleteEmoji;
  onFileChosen?: (name: string) => void;
  onOpenUpload: () => void;
}

export default class EmojiPickerFooter extends PureComponent<Props, {}> {
  render() {
    const {
      initialUploadName,
      onToneSelected,
      onUploadCancelled,
      onUploadEmoji,
      onCloseDelete,
      onDeleteEmoji,
      selectedEmoji,
      selectedTone,
      toneEmoji,
      uploadErrorMessage,
      uploading,
      onFileChosen,
      onOpenUpload,
      uploadEnabled,
      emojiToDelete,
    } = this.props;

    const previewFooterClassnames = classNames([
      styles.emojiPickerFooter,
      styles.emojiPickerFooterWithTopShadow,
    ]);

    if (uploading) {
      return (
        <div className={previewFooterClassnames}>
          <EmojiUploadPicker
            onUploadCancelled={onUploadCancelled}
            onUploadEmoji={onUploadEmoji}
            onFileChosen={onFileChosen}
            errorMessage={uploadErrorMessage}
            initialUploadName={initialUploadName}
          />
        </div>
      );
    }

    if (emojiToDelete) {
      return (
        <div className={previewFooterClassnames}>
          <EmojiDeletePreview
            emoji={emojiToDelete}
            onDeleteEmoji={onDeleteEmoji}
            onCloseDelete={onCloseDelete}
          />
        </div>
      );
    }

    return (
      <div className={previewFooterClassnames}>
        <EmojiPreview
          emoji={selectedEmoji}
          toneEmoji={toneEmoji}
          selectedTone={selectedTone}
          onToneSelected={onToneSelected}
          onOpenUpload={onOpenUpload}
          uploadEnabled={uploadEnabled}
        />
      </div>
    );
  }
}
