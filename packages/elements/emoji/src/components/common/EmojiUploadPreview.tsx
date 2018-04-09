import * as React from 'react';
import { PureComponent } from 'react';
import { UploadStatus } from './internal-types';
import { EmojiDescription } from '../../types';
import { customCategory } from '../../constants';
import Emoji from './Emoji';
import AkButton from '@atlaskit/button';
import * as styles from './styles';
import RetryableButton from './RetryableButton';
import EmojiErrorMessage from './EmojiErrorMessage';

export interface EmojiUploadPreviewProps {
  name: string;
  previewImage: string;
  uploadStatus?: UploadStatus;
  errorMessage?: string;
  onUploadCancelled: () => void;
  onAddEmoji: () => void;
}

export default class EmojiUploadPreview extends PureComponent<
  EmojiUploadPreviewProps,
  {}
> {
  render() {
    const {
      name,
      previewImage,
      uploadStatus,
      errorMessage,
      onAddEmoji,
      onUploadCancelled,
    } = this.props;

    let emojiComponent;

    if (previewImage) {
      const emoji: EmojiDescription = {
        shortName: `:${name}:`,
        type: customCategory,
        category: customCategory,
        representation: {
          imagePath: previewImage,
          width: 24,
          height: 24,
        },
        searchable: true,
      };

      emojiComponent = <Emoji emoji={emoji} />;
    }

    const uploading = uploadStatus === UploadStatus.Uploading;

    return (
      <div className={styles.uploadPreviewFooter}>
        <div className={styles.uploadPreview}>
          <div className={styles.uploadPreviewText}>
            <h5>Preview</h5>
            Your new emoji {emojiComponent} looks great
          </div>
          <div className={styles.bigEmojiPreview}>{emojiComponent}</div>
        </div>
        <div className={styles.uploadAddRow}>
          {errorMessage ? (
            <EmojiErrorMessage
              className={styles.emojiPreviewErrorMessage}
              message={errorMessage}
            />
          ) : null}
          <RetryableButton
            className={styles.uploadEmojiButton}
            retryClassName={styles.uploadRetryButton}
            label="Add emoji"
            onSubmit={onAddEmoji}
            appearance="primary"
            loading={uploading}
            error={!!errorMessage}
          />
          <AkButton
            onClick={onUploadCancelled}
            appearance="subtle"
            isDisabled={uploading}
          >
            Cancel
          </AkButton>
        </div>
      </div>
    );
  }
}
