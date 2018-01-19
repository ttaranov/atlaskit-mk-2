import * as React from 'react';
import MentionTextInput from '../example-helpers/demo-mention-text-input';
import {
  resourceProvider,
  MockPresenceProvider,
} from '../src/support/story-data';
import { onSelection } from '../example-helpers';

export default function Example() {
  return (
    <MentionTextInput
      label="User search"
      onSelection={onSelection}
      resourceProvider={resourceProvider}
      presenceProvider={new MockPresenceProvider()}
    />
  );
}
