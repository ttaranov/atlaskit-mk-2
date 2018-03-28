import * as React from 'react';

import Emoji from '../src/components/common/Emoji';
import { getEmojiRepository } from '../example-helpers';

const emojiService = getEmojiRepository();

const renderEmoji = (fitToHeight: number = 24) => {
  const zoidberg = emojiService.findByShortName(':zoidberg:');
  const zoidbergEmoji = zoidberg ? (
    <Emoji emoji={zoidberg} showTooltip={true} fitToHeight={fitToHeight} />
  ) : (
    <span>[zoidberg emoji not found]</span>
  );
  const awthanks = emojiService.findByShortName(':awthanks:');
  const awthanksEmoji = awthanks ? (
    <Emoji
      emoji={awthanks}
      showTooltip={true}
      fitToHeight={fitToHeight}
      selected={true}
    />
  ) : (
    <span>[awthanks emoji not found]</span>
  );
  const grimacing = emojiService.findByShortName(':grimacing:');
  const grimacingEmoji = grimacing ? (
    <Emoji emoji={grimacing} showTooltip={true} fitToHeight={fitToHeight} />
  ) : (
    <span>[grimacing emoji not found]</span>
  );
  return (
    <div style={{ lineHeight: `${fitToHeight}px` }}>
      {zoidbergEmoji}
      {awthanksEmoji}
      {grimacingEmoji}
    </div>
  );
};

export default function Example() {
  return (
    <div>
      <p>{renderEmoji()}</p>
      <p>{renderEmoji(32)}</p>
      <p>{renderEmoji(48)}</p>
      <p>{renderEmoji(128)}</p>
    </div>
  );
}
