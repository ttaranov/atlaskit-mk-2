// @flow

import React from 'react';
import { Field } from '@atlaskit/form';
import { cities } from './common/data';
import Select from '../src';

const errorMsg = 'This field is required.';

const ValidationExample = () => (
  <div>
    <Field label="Failed Select" invalidMessage={errorMsg} isInvalid>
      <Select options={cities} placeholder="Choose a City" />
    </Field>
    <hr style={{ border: 0, margin: '1em 0' }} />
    <Field
      label="Successful Select"
      helperText="This select is successful"
      id="success"
      isInvalid={false}
    >
      <Select
        options={cities}
        defaultValue={cities[0]}
        placeholder="Choose a City"
      />
    </Field>
  </div>
);

export default ValidationExample;
