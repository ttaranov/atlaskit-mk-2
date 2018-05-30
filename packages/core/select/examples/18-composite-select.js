// @flow
import React, { Fragment } from 'react';
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

const CompositeSelectExample = () => (
  <div css={{ display: 'flex', justifyContent: 'space-between' }}>
    <CompositeSelect
      target={<button>Target</button>}
      options={options}
      placeholder="Choose a City"
    />
    <CompositeSelect
      target={<button>W/O Search</button>}
      options={options}
      menuPlacement="bottom"
      placeholder="Choose a City"
      searchThreshold={10}
    />
    <CompositeSelect
      target={<button>Placement: &ldquo;right-start&rdquo; (flip)</button>}
      options={options}
      menuPlacement="right-start"
      placeholder="Choose a City"
    />
  </div>
);

export default CompositeSelectExample;
