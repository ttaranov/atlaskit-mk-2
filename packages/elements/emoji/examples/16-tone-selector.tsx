import * as React from 'react';
import ToneSelector from '../src/components/common/ToneSelector';
import filters from '../src/util/filters';
import { getEmojis } from '../src/support/story-data';
import { onToneSelected } from '../example-helpers';

const toneEmoji = filters.toneEmoji(getEmojis());

export default function Example() {
  return <ToneSelector emoji={toneEmoji} onToneSelected={onToneSelected} />;
}
