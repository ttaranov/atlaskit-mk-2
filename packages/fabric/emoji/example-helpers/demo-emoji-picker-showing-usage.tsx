import * as React from 'react';

import Layer from '@atlaskit/layer';

import EmojiPicker from '../src/components/picker/EmojiPicker';
import { UsageClearEmojiResource } from '../src/support/MockEmojiResource';
import { UsageShowAndClearComponent } from './demo-emoji-usage-components';

export interface Props {
  emojiResource: UsageClearEmojiResource;
}

export interface State {
  emojiIdList: Array<string>;
  emojiQueue: Array<string>;
}

export default class UsageShowingEmojiPickerTextInput extends UsageShowAndClearComponent {
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
            emojiProvider={Promise.resolve(emojiResource)}
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
