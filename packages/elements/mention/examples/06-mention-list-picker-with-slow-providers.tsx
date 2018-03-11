import * as React from 'react';
import { akZIndexLayer } from '@atlaskit/util-shared-styles';
import MentionTextInput from '../example-helpers/demo-mention-text-input';
import {
  MockPresenceProvider,
  slowResourceProvider,
} from '../src/support/story-data';
import { onSelection } from '../example-helpers';

const tallPageStyle: React.CSSProperties = {
  height: '2000px',
};

const downPage: React.CSSProperties = {
  position: 'absolute',
  top: '400px',
};

export default function Example() {
  return (
    <div style={tallPageStyle}>
      <div style={downPage}>
        <MentionTextInput
          label="User search"
          onSelection={onSelection}
          resourceProvider={slowResourceProvider}
          presenceProvider={new MockPresenceProvider(200, 500)}
          relativePosition="above"
          zIndex={akZIndexLayer}
        />
      </div>
    </div>
  );
}
