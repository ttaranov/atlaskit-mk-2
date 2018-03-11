import * as React from 'react';
import EmojiPreview from '../src/components/common/EmojiPreview';
import { emojiPickerWidth } from '../src/constants';

const emoji = {
  id: '118608',
  name: 'Zoidberg',
  shortName: ':zoidberg:',
  type: 'ATLASSIAN',
  category: 'ATLASSIAN',
  order: 2147483647,
  skinVariations: [],
  representation: {
    imagePath:
      'https://dujrsrsgsd3nh.cloudfront.net/img/emoticons/zoidberg-1417754444.png',
    height: 24,
    width: 30,
  },
  hasSkinVariations: false,
  searchable: true,
};

const borderedStyle = {
  margin: '20px',
  border: '1px solid #ddd',
  backgroundColor: 'white',
  width: emojiPickerWidth,
};

export default function Example() {
  return (
    <div style={borderedStyle}>
      <EmojiPreview emoji={emoji} />
    </div>
  );
}
