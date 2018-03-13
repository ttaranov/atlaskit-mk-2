import * as React from 'react';
import * as classNames from 'classnames';
import { getEmojis } from '../src/support/story-data';
import EmojiPickerList from '../src/components/picker/EmojiPickerList';

import * as styles from '../src/components/picker/styles';

export default function Example() {
  return (
    <div className={classNames([styles.emojiPicker])}>
      <EmojiPickerList emojis={getEmojis()} />
    </div>
  );
}
