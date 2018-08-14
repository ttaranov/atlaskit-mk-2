import * as React from 'react';
import { ReactionProvider, MockReactionsAdapter } from '@atlaskit/reactions';
import {
  MockProvider as ConversationResource,
  getDataProviderFactory,
} from '../example-helpers/MockProvider';
import { Demo } from '../example-helpers/DemoPage';
import { MOCK_USERS } from '../example-helpers/MockData';

const provider = new ConversationResource({
  url: 'http://localhost:8080',
  user: MOCK_USERS[0],
});

const reactionAdapter = new MockReactionsAdapter();

export default function Example() {
  return (
    <ReactionProvider adapter={reactionAdapter}>
      <Demo provider={provider} dataProviders={getDataProviderFactory()} />
    </ReactionProvider>
  );
}
