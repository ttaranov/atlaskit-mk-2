import * as React from 'react';
import * as classNames from 'classnames';
import { getEmojis } from '../example-helpers';
import EmojiPickerList from '../src/picker/EmojiPickerList';

import * as styles from '../src/picker/styles';

export default function Example() {
  return (
    <div className={classNames([styles.emojiPicker])}>
      <EmojiPickerList emojis={getEmojis()} />
    </div>
  );
}
