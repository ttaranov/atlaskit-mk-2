// @flow

import React from 'react';
import { Select } from './common/components';
import { countries } from './common/data';

/**
  Take your data structure and manipulate it before render. We're working with
  the following shape for countries:
  {
    icon: string,
    name: string,
    abbr: string,
    code: number,
    suggested?: boolean,
  }

  The following formatters are available:
  - optionLabel
  - optionValue
  - valueLabel
*/

// join the applicable values to create an option label
const optionLabel = ({ abbr, code, icon, name, options }) => {
  if (options) return name; // this has options; it's a group, just return the name
  return `${icon} ${name} (${abbr.toUpperCase()}) +${code}`;
};

// we only want the country's abbreviation for the option value
const optionValue = ({ abbr }) => abbr;

// the display value will be the country's flag and abbreviated name
const valueLabel = ({ abbr, icon }: { abbr: string, icon: string }) => (
  <div style={{ lineHeight: 1.4 }}>
    {icon} {abbr.toUpperCase()}
  </div>
);

// break all countries into groups
const groupedCountries = [
  {
    name: 'Suggested',
    options: countries.filter(c => c.suggested),
  },
  {
    name: 'All Countries',
    options: countries.filter(c => !c.suggested),
  },
];

// put it all together
export default () => (
  <Select
    options={groupedCountries}
    formatters={{ optionLabel, optionValue, valueLabel }}
    placeholder="Choose a Country"
  />
);
