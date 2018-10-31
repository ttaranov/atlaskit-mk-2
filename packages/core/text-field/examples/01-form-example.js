// @flow

import React from 'react';
import Button from '@atlaskit/button';
import TextField from '../src';

const formTestUrl = '//httpbin.org/get';

const iframeStyles = {
  width: '95%',
  height: '300px',
  borderStyle: 'dashed',
  borderWidth: '1px',
  borderColor: '#ccc',
  padding: '0.5em',
  color: '#ccc',
  margin: '0.5em',
};

type Props = {};

export default function() {
  return (
    <div>
      <form
        action={formTestUrl}
        method="GET"
        style={{ backgroundColor: 'white' }}
        target="submitFrame"
      >
        <TextField name="example-text" defaultValue="A default value" />
        <p>
          <Button type="submit" appearance="primary">
            Submit
          </Button>
        </p>
      </form>
      <p>The data submitted by the form will appear below:</p>
      <iframe
        src=""
        title="Checkbox Resopnse Frame"
        id="submitFrame"
        name="submitFrame"
        style={iframeStyles}
      />
    </div>
  );
}
