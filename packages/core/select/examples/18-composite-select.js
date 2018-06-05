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

const onChange = console.log;
const defaults = { options, placeholder: 'Choose a City', onChange };

const CompositeSelectExample = () => (
  <Fragment>
    <div css={{ display: 'flex', justifyContent: 'space-between' }}>
      <CompositeSelect {...defaults} target={<button>Target</button>} />
      <CompositeSelect
        {...defaults}
        target={<button>W/O Search</button>}
        popperProps={{ placement: 'bottom', positionFixed: true }}
        searchThreshold={10}
      />
      <CompositeSelect
        {...defaults}
        target={<button>Placement: &ldquo;right-start&rdquo; (flip)</button>}
        popperProps={{ placement: 'right-start' }}
      />
    </div>
    <div
      style={{
        background: 'AliceBlue',
        marginBottom: '1em',
        marginTop: '1em',
        padding: '1em',
        height: 500,
        width: 300,
        overflowY: 'auto',
      }}
    >
      <h3>Scroll Container</h3>
      <div style={{ height: 100 }} />
      <CompositeSelect {...defaults} target={<button>Target</button>} />
      <div style={{ height: 1000 }} />
    </div>
    <div style={{ height: 1000 }} />
  </Fragment>
);

export default CompositeSelectExample;
