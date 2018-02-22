import * as React from 'react';
import Layer from '@atlaskit/layer';
import EmojiPicker from '../src/components/picker/EmojiPicker';

import { getEmojiResource, lorem } from '../src/support/story-data';
import { onSelection } from '../example-helpers/index';

export default function Example() {
  return (
    <div style={{ padding: '10px' }}>
      <Layer
        content={
          <EmojiPicker
            emojiProvider={getEmojiResource({
              uploadSupported: true,
              currentUser: { id: 'blackpanther' },
            })}
            onSelection={onSelection}
          />
        }
        position="bottom left"
      >
        <input
          id="picker-input"
          style={{
            height: '20px',
            margin: '10px',
          }}
        />
      </Layer>
      <p style={{ width: '400px' }}>{lorem}</p>
    </div>
  );
}
