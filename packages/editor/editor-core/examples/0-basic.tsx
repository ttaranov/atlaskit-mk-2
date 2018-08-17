import * as React from 'react';
import Editor from './../src/editor';
import { IntlProvider } from 'react-intl';

export default function Example() {
  return (
    <div>
      <p>
        The most basic editor possible. Editor you get by rendering{' '}
        {'<Editor/>'} component with no props.
      </p>
      <IntlProvider locale="en">
        <Editor appearance="message" />
      </IntlProvider>
    </div>
  );
}
