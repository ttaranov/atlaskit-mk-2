import * as React from 'react';
import { ConversationResource } from '../src/api/ConversationResource';
import { Demo } from '../example-helpers/DemoPage';

const provider = new ConversationResource({
  url: 'http://localhost:8080',
});

export default function Example() {
  return <Demo provider={provider} />;
}
