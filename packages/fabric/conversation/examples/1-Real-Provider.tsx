import * as React from 'react';
import Conversation from '../src/components/Conversation';
import {
  Comment as CommentType,
  Conversation as ConversationType,
} from '../src/model';
import { ConversationResource } from '../src/api/ConversationResource';
import { Demo } from '../example-helpers/DemoPage';

const provider = new ConversationResource({
  containerId: 'container:abc:abc/123',
  externalId: 'abc:abc:abc/demo',
  url: 'http://localhost:8080',
});

export default function Example() {
  return <Demo provider={provider} />;
}
