// tslint:disable:no-console
import * as React from 'react';
import { default as Editor } from '../src';
import ExampleWrapper from '../example-helpers/ExampleWrapper';

export default function Component() {
  return (
    <ExampleWrapper render={handleChange => <Editor onChange={handleChange} allowLists={true} />} />
  );
}
