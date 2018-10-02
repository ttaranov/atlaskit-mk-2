import { ReactionContext } from '@atlaskit/reactions';
import { MockReactionsClient } from '@atlaskit/reactions/src/client/MockReactionsClient';
import * as React from 'react';
import { Demo } from '../example-helpers/DemoPage';
import { MOCK_USERS } from '../example-helpers/MockData';
import {
  getDataProviderFactory,
  MockProvider as ConversationResource,
} from '../example-helpers/MockProvider';

const provider = new ConversationResource({
  url: 'http://localhost:8080',
  user: MOCK_USERS[0],
});

const reactionClient = new MockReactionsClient();

export default function Example() {
  return (
    <ReactionContext client={reactionClient}>
      <Demo provider={provider} dataProviders={getDataProviderFactory()} />
    </ReactionContext>
  );
}
