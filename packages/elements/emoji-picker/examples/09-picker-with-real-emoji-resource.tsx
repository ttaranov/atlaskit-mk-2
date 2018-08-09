import * as React from 'react';
import Layer from '@atlaskit/layer';
import EmojiPicker from '../../emoji/dist/es5';
import ResourcedEmojiControl, {
  getEmojiConfig,
  getRealEmojiResource,
} from '../example-helpers/demo-resource-control';
import { onSelection } from '../example-helpers';
import { emojiPickerHeight } from '../src/common/constants';

const getPicker = () => (
  <div style={{ padding: '10px' }}>
    <Layer
      content={
        <EmojiPicker
          emojiProvider={getRealEmojiResource()}
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
  </div>
);

export default function Example() {
  return (
    <ResourcedEmojiControl
      emojiConfig={getEmojiConfig()}
      customEmojiProvider={getRealEmojiResource()}
      children={getPicker()}
      customPadding={emojiPickerHeight}
    />
  );
}
