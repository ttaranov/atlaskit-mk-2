import * as React from 'react';

import { EmojiDescription } from '../src/types';
import { UsageClearEmojiResource } from '../src/support/MockEmojiResource';
import EmojiTextInput from './demo-emoji-typeahead-text-input';
import { UsageShowAndClearComponent } from './demo-emoji-usage-components';

export interface UsagingShowingProps {
  emojiResource: UsageClearEmojiResource;
}

export interface UsageShowingState {
  emojiList: Array<EmojiDescription>;
  emojiQueue: Array<string>;
}

export default class UsageShowingEmojiTypeAheadTextInput extends UsageShowAndClearComponent {
  constructor(props) {
    super(props);
  }

  getWrappedComponent() {
    const { emojiResource } = this.props;
    return (
      <EmojiTextInput
        label="Emoji search"
        onSelection={this.onSelection}
        emojiProvider={Promise.resolve(emojiResource)}
        position="below"
      />
    );
  }
}
