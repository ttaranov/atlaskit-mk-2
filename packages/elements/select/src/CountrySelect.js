// @flow

import React from 'react';
import styled from 'styled-components';

import { groupedCountries } from './data/countries';
import Select from './Select';

// flow stuff
type OptionType = { abbr: string, code: number, icon: string, name: string };

// custom option renderer
const Label = styled.div`
  align-items: center;
  display: flex;
  line-height: 1.2;
`;
const Flag = styled.span`
  font-size: 18px;
  margin-right: 8px;
`;
const Opt = ({ children, icon }: any) => (
  <Label>
    <Flag>{icon}</Flag>
    {children}
  </Label>
);

// return the country name; used for searching
const getOptionLabel = (opt: OptionType) => opt.name;

// set the country's abbreviation for the option value, (also searchable)
const getOptionValue = (opt: OptionType) => opt.abbr;

// the text node of the control
const controlLabel = (opt: OptionType) => (
  <Opt icon={opt.icon}>{opt.abbr.toUpperCase()}</Opt>
);
// the text node for an option
const optionLabel = ({ abbr, code, icon, name }: OptionType) => (
  <Opt icon={icon}>
    {name} ({abbr.toUpperCase()}) +{code}
  </Opt>
);

// switch formatters based on render context (menu | value)
const formatOptionLabel = (opt: OptionType, { context }) =>
  context === 'value' ? controlLabel(opt) : optionLabel(opt);

// put it all together
const CountrySelect = (props: any) => (
  <Select
    // components={{ Menu }}
    isClearable={false}
    formatOptionLabel={formatOptionLabel}
    getOptionLabel={getOptionLabel}
    getOptionValue={getOptionValue}
    isMulti={false}
    options={groupedCountries}
    styles={{
      container: css => ({ ...css, width: 105 }),
      dropdownIndicator: css => ({ ...css, paddingLeft: 0 }),
      menu: css => ({ ...css, width: 300 }),
    }}
    {...props}
  />
);

export default CountrySelect;
