import * as React from 'react';
import Layer from '@atlaskit/layer';
import EmojiPicker from '../src/components/picker/EmojiPicker';

import {
  getEmojiResource,
  getEmojiResourceWithStandardAndAtlassianEmojis,
  loggedUser,
  lorem,
} from '../example-helpers';
import { onSelection } from '../example-helpers/index';
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

export interface EmojiState {
  siteEmojiEnabled: boolean;
}

export interface EmojiProps {}

export default class EmojiPickerWithUpload extends React.Component<
  EmojiProps,
  EmojiState
> {
  constructor(props: EmojiProps) {
    super(props);
    this.state = {
      siteEmojiEnabled: true,
    };
  }

  enableSiteEmoji(value: boolean) {
    this.setState({ siteEmojiEnabled: value });
  }

  render() {
    const emojiProvider: Promise<EmojiProvider> =
      this.state.siteEmojiEnabled === true
        ? getEmojiResource({
            uploadSupported: true,
            currentUser: { id: loggedUser },
          })
        : getEmojiResourceWithStandardAndAtlassianEmojis({
            uploadSupported: true,
            currentUser: { id: loggedUser },
          });
    return (
      <AnalyticsListenerNext
        onEvent={listenerHandlerNext}
        channel="fabric-elements"
      >
        <AnalyticsListener onEvent={listenerHandler} matchPrivate={true}>
          <AnalyticsContextNext data={{ analyticsContextTest: true }}>
            <div style={{ padding: '10px' }}>
              <Layer
                content={
                  <EmojiPicker
                    emojiProvider={emojiProvider}
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
              <p style={{ width: '400px' }}>
                {lorem}
                {lorem}
              </p>

              <button onClick={() => this.enableSiteEmoji(true)}>
                EmojiProvider with Site emoji
              </button>
              <button onClick={() => this.enableSiteEmoji(false)}>
                EmojiProvider without Site emoji
              </button>
            </div>
          </AnalyticsContextNext>
        </AnalyticsListener>
      </AnalyticsListenerNext>
    );
  }
}
