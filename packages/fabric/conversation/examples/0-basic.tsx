import * as React from 'react';
import Conversation from '../src/components/Conversation';
import {
  Comment as CommentType,
  Conversation as ConversationType,
} from '../src/model';
import { MockProvider as ConversationResource } from '../example-helpers/MockProvider';
import { Demo } from '../example-helpers/DemoPage';
import { MOCK_USERS } from '../example-helpers/MockData';
import { providers } from '../example-helpers/ToolsDrawer';
import ProviderFactoryWithList from '../src/api/ProviderFactoryWithList';

const provider = new ConversationResource({
  url: 'http://localhost:8080',
  user: MOCK_USERS[0],
});

const dataProviderFactory = new ProviderFactoryWithList();
Object.keys(providers).forEach(provider => {
  dataProviderFactory.setProvider(provider, providers[provider].resolved);
});

export default function Example() {
  return <Demo provider={provider} dataProviderFactory={dataProviderFactory} />;
}
