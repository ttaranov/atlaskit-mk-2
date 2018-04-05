import * as React from 'react';
import { PureComponent } from 'react';
import { UploadStatus } from './internal-types';
import { EmojiDescription } from '../../types';
import { customCategory } from '../../constants';
import Emoji from './Emoji';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import AkButton from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import * as styles from './styles';

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
    const spinner = uploading ? <Spinner size="medium" /> : undefined;

    const error = !errorMessage ? (
      undefined
    ) : (
      <span className={styles.uploadError}>
        <ErrorIcon label="Error" /> {errorMessage}
      </span>
    );

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
          <AkButton
            onClick={onAddEmoji}
            appearance="primary"
            isDisabled={uploading}
          >
            Add emoji
          </AkButton>
          <AkButton
            onClick={onUploadCancelled}
            appearance="link"
            isDisabled={uploading}
          >
            Cancel
          </AkButton>
          {spinner}
          {error}
        </div>
      </div>
    );
  }
}
