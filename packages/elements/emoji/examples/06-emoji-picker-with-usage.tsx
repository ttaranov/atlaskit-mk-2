import * as React from 'react';
import Layer from '@atlaskit/layer';
import EmojiPicker from '../src/components/picker/EmojiPicker';

import { getUsageClearEmojiResource } from '../example-helpers';
import { UsageShowAndClearComponent } from '../example-helpers/demo-emoji-usage-components';
import { EmojiProvider } from '../src/api/EmojiResource';

import { AnalyticsListener } from '@atlaskit/analytics';
import {
  AnalyticsListener as AnalyticsListenerNext,
  AnalyticsContext as AnalyticsContextNext,
} from '@atlaskit/analytics-next';

import debug from '../src/util/logger';

function listenerHandler(eventName: string, eventData: Object) {
  debug(`[analytics] listenerHandler event: ${eventName} `, eventData);
}

const listenerHandlerNext = e => {
  debug(
    '[analytics-next] AnalyticsListener event - payload:',
    e.payload,
    ' context: ',
    e.context,
  );
};

class UsageShowingEmojiPickerTextInput extends UsageShowAndClearComponent {
  constructor(props) {
    super(props);
  }

  getWrappedComponent() {
    const { emojiResource } = this.props;
    return (
      <Layer
        content={
          <AnalyticsListenerNext
            onEvent={listenerHandlerNext}
            channel="fabric-elements"
          >
            <AnalyticsListener onEvent={listenerHandler} matchPrivate={true}>
              <AnalyticsContextNext data={{ analyticsContextTest: true }}>
                <EmojiPicker
                  onSelection={this.onSelection}
                  emojiProvider={Promise.resolve(
                    emojiResource as EmojiProvider,
                  )}
                />
              </AnalyticsContextNext>
            </AnalyticsListener>
          </AnalyticsListenerNext>
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
