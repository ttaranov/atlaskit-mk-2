// @flow
import React from 'react';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import Select from '../src';

const formatOptionLabel = (option, { context }) => {
  if (context === 'menu') {
    return (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AtlassianIcon />
        {option.label}
      </span>
    );
  }
  return option.label;
};
const ElementBeforeExample = () => (
  <Select
    formatOptionLabel={formatOptionLabel}
    options={[
      { label: 'Adelaide', value: 'adelaide' },
      { label: 'Brisbane', value: 'brisbane' },
      { label: 'Canberra', value: 'canberra' },
      { label: 'Darwin', value: 'darwin' },
      { label: 'Hobart', value: 'hobart' },
      { label: 'Melbourne', value: 'melbourne' },
      { label: 'Perth', value: 'perth' },
      { label: 'Sydney', value: 'sydney' },
    ]}
  />
);

export default ElementBeforeExample;
