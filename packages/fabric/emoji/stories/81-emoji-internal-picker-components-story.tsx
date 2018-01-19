import { storiesOf, action } from '@kadira/storybook';
import * as React from 'react';
import * as classNames from 'classnames';

import { name } from '../package.json';
import { getEmojis } from '../src/support/story-data';

import CategorySelector from '../src/components/picker/CategorySelector';
import EmojiPickerFooter from '../src/components/picker/EmojiPickerFooter';
import EmojiPickerList from '../src/components/picker/EmojiPickerList';
import ToneSelector from '../src/components/common/ToneSelector';
import EmojiUploadPicker from '../src/components/common/EmojiUploadPicker';

import * as styles from '../src/components/picker/styles';
import { emojiPickerWidth } from '../src/constants';
import filters from '../src/util/filters';

const emojis = getEmojis();

const toneEmoji = filters.toneEmoji(emojis);

const defaultStyles = {
  width: emojiPickerWidth,
  border: '1px solid #ccc',
  margin: '20px',
};

storiesOf(`${name}/Internal picker components`, module)
  .add('emoji picker list', () => (
    <div className={classNames([styles.emojiPicker])}>
      <EmojiPickerList emojis={emojis} />
    </div>
  ))
  .add('category selector', () => <CategorySelector />)
  .add('picker footer', () => (
    <EmojiPickerFooter
      selectedEmoji={emojis[0]}
      uploading={false}
      onUploadEmoji={action('emoji uploaded')}
      onUploadCancelled={action('emoji cancelled')}
    />
  ))
  .add('tone selector', () => (
    <ToneSelector emoji={toneEmoji} onToneSelected={action('tone selected')} />
  ))
  .add('Emoji upload component', () => (
    <div style={defaultStyles}>
      <EmojiUploadPicker
        onUploadEmoji={action('emoji uploaded')}
        onUploadCancelled={action('emoji cancelled')}
      />
    </div>
  ))
  .add('Emoji upload component error', () => {
    return (
      <div style={defaultStyles}>
        <EmojiUploadPicker
          errorMessage="Unable to upload"
          onUploadEmoji={action('emoji uploaded')}
          onUploadCancelled={action('emoji cancelled')}
        />
      </div>
    );
  });
