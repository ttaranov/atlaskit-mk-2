import * as React from 'react';
import EmojiPreview from '../src/components/common/EmojiPreview';
import { emojiTypeAheadWidth } from '../src/shared-styles';
import { getEmojis, onToneSelected } from '../example-helpers';
import filters from '../src/util/filters';
import ToneSelector from '../src/components/common/ToneSelector';

const emojis = getEmojis();

const borderedStyle = {
  margin: '20px',
  border: '1px solid #ddd',
  backgroundColor: 'white',
  width: emojiTypeAheadWidth,
};

const emoji = filters.byShortName(emojis, ':slight_smile:');

const tongueEmoji = filters.byShortName(
  emojis,
  ':stuck_out_tongue_closed_eyes:',
);
const longTongueEmoji = {
  ...tongueEmoji,
  name: `${tongueEmoji.name} ${tongueEmoji.name} ${tongueEmoji.name}`,
  shortName: `${tongueEmoji.shortName}_${tongueEmoji.shortName}_${
    tongueEmoji.shortName
  }`,
};

const toneEmoji = filters.toneEmoji(emojis);

export default function Example() {
  return (
    <div>
      <div style={borderedStyle}>
        <EmojiPreview emoji={emoji} />
      </div>
      <div style={borderedStyle}>
        <EmojiPreview emoji={longTongueEmoji} toneEmoji={toneEmoji} />
      </div>
      <ToneSelector emoji={toneEmoji} onToneSelected={onToneSelected} />
    </div>
  );
}
