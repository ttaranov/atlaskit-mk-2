import * as React from 'react';
import Layer from '@atlaskit/layer';

import { getUsageClearEmojiResource } from '../example-helpers';
import { UsageShowAndClearComponent } from '../example-helpers/demo-emoji-usage-components';
import EmojiPicker, { EmojiProvider } from '../../emoji/dist/es5';

class UsageShowingEmojiPickerTextInput extends UsageShowAndClearComponent {
  constructor(props) {
    super(props);
  }

  getWrappedComponent() {
    const { emojiResource } = this.props;
    return (
      <Layer
        content={
          <EmojiPicker
            onSelection={this.onSelection}
            emojiProvider={Promise.resolve(emojiResource as EmojiProvider)}
          />
        }
        position="bottom left"
      >
        <input
          id="picker-input"
          style={{
            height: '20px',
            marginBottom: '320px',
          }}
        />
      </Layer>
    );
  }
}

export default function Example() {
  return (
    <UsageShowingEmojiPickerTextInput
      emojiResource={getUsageClearEmojiResource()}
    />
  );
}
