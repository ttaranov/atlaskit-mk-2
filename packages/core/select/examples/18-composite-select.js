// @flow
import React from 'react';
import { CompositeSelect } from '../src';

const options = [
  { label: 'Adelaide', value: 'adelaide' },
  { label: 'Brisbane', value: 'brisbane' },
  { label: 'Canberra', value: 'canberra' },
  { label: 'Darwin', value: 'darwin' },
  { label: 'Hobart', value: 'hobart' },
  { label: 'Melbourne', value: 'melbourne' },
  { label: 'Perth', value: 'perth' },
  { label: 'Sydney', value: 'sydney' },
];

const onChange = console.log;
const defaults = { options, placeholder: 'Choose a City', onChange };

const CompositeSelectExample = () => (
  <div css={{ display: 'flex', justifyContent: 'space-between' }}>
    <CompositeSelect {...defaults} target={<button>Target</button>} />
    <CompositeSelect
      {...defaults}
      target={<button>W/O Search</button>}
      menuPlacement="bottom"
      searchThreshold={10}
    />
    <CompositeSelect
      {...defaults}
      target={<button>Placement: &ldquo;right-start&rdquo; (flip)</button>}
      menuPlacement="right-start"
    />
  </div>
);

export default CompositeSelectExample;
