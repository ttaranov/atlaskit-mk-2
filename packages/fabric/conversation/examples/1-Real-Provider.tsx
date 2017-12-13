import * as React from 'react';
import Conversation from '../src/components/Conversation';
import {
  Comment as CommentType,
  Conversation as ConversationType,
} from '../src/model';
import { ConversationResource } from '../src/api/ConversationResource';
import { Demo } from '../example-helpers/DemoPage';

const provider = new ConversationResource({
  url: 'http://localhost:9999',
});

export default function Example() {
  return <Demo provider={provider} />;
}
