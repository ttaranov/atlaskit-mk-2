// tslint:disable:no-console
import * as React from 'react';
import { default as Editor } from '../src';
import ExampleWrapper from '../example-helpers/ExampleWrapper';
import MentionResource from '../example-helpers/mentions/mention-resource';
const mentionEncoder = (userId: string) => `/secure/ViewProfile?name=${userId}`;

export default function Component() {
  return (
    <ExampleWrapper
      render={handleChange => (
        <Editor
          onChange={handleChange}
          mentionProvider={Promise.resolve(new MentionResource())}
          mentionEncoder={mentionEncoder}
        />
      )}
    />
  );
}
