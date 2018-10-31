// @flow

import React from 'react';
import { Field } from '@atlaskit/form';
import TextField from '../src';

export default function() {
  return (
    <div>
      <Field label="xsmall">
        <TextField size="xsmall" />
      </Field>

      <Field label="small">
        <TextField size="small" />
      </Field>

      <Field label="medium">
        <TextField size="medium" />
      </Field>

      <Field label="large">
        <TextField size="large" />
      </Field>

      <Field label="xlarge">
        <TextField size="xlarge" />
      </Field>

      <Field label="custom width (eg, 546)">
        <TextField size="546" />
      </Field>

      <Field label="default (100%)">
        <TextField />
      </Field>
    </div>
  );
}
