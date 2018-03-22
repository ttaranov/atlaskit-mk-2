// @flow

import React from 'react';

import Select from '../src';

const OPTIONS = [
  { label: 'Adelaide', value: 'adelaide' },
  { label: 'Brisbane', value: 'brisbane' },
  { label: 'Canberra', value: 'canberra' },
  { label: 'Darwin', value: 'darwin' },
  { label: 'Hobart', value: 'hobart' },
  { label: 'Melbourne', value: 'melbourne' },
  { label: 'Perth', value: 'perth' },
  { label: 'Sydney', value: 'sydney' },
];

type IndicatorProps = {
  getStyles: (string, any) => {},
  innerProps: any,
};

const ClearIndicator = (props: IndicatorProps) => {
  const { getStyles, innerProps: { ref, ...restInnerProps } } = props;
  return (
    <div
      {...restInnerProps}
      ref={ref}
      style={getStyles('clearIndicator', props)}
    >
      <div style={{ padding: '0px 5px' }}>Clear All</div>
    </div>
  );
};

const ClearIndicatorStyles = (base, state) => ({
  ...base,
  cursor: 'pointer',
  color: state.isFocused ? 'blue' : 'black',
});

export default function CustomClearIndicator() {
  return (
    <Select
      components={{ ClearIndicator }}
      styles={{ clearIndicator: ClearIndicatorStyles }}
      defaultValue={[OPTIONS[4], OPTIONS[5]]}
      isMulti
      options={OPTIONS}
    />
  );
}
