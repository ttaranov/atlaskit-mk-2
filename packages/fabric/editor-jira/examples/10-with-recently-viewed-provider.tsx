// tslint:disable:no-console
import * as React from 'react';
import { default as Editor } from '../src';
import ExampleWrapper from '../example-helpers/ExampleWrapper';
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';

export default function Component() {
  return (
    <ExampleWrapper
      render={handleChange => (
        <Editor
          onChange={handleChange}
          allowLinks={true}
          activityProvider={Promise.resolve(new MockActivityResource())}
        />
      )}
    />
  );
}
