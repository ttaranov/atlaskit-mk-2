import * as React from 'react';
import * as classNames from 'classnames';
import {
  getEmojis,
  onUploadEmoji,
  onUploadCancelled,
} from '../example-helpers';
import EmojiPickerList from '../src/picker/EmojiPickerList';

import * as styles from '../src/picker/styles';
import CategorySelector from '../src/picker/CategorySelector';
import { emojiPickerWidth } from '../src/constants';
import EmojiUploadPicker from '../src/common/EmojiUploadPicker';

const defaultStyles = {
  width: emojiPickerWidth,
  border: '1px solid #ccc',
  margin: '20px',
};

export default function Example() {
  return (
    <div>
      <div className={classNames([styles.emojiPicker])}>
        <EmojiPickerList emojis={getEmojis()} />
      </div>
      <CategorySelector />
      <div style={defaultStyles}>
        <EmojiUploadPicker
          onUploadEmoji={onUploadEmoji}
          onUploadCancelled={onUploadCancelled}
        />
      </div>
      <div style={defaultStyles}>
        <EmojiUploadPicker
          errorMessage="Unable to upload"
          onUploadEmoji={onUploadEmoji}
          onUploadCancelled={onUploadCancelled}
        />
      </div>
    </div>
  );
}
