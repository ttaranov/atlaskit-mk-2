// @flow
import { withValue } from 'react-value';
import BaseSelect, {
  CheckboxSelect as BaseCheckboxSelect,
  CountrySelect as BaseCountrySelect,
  RadioSelect as BaseRadioSelect,
} from '../../src';

// simple handler for onChange and value in examples
export const Select = withValue(BaseSelect);
Select.displayName = 'ExampleSelectWithValue';

export const CheckboxSelect = withValue(BaseCheckboxSelect);
CheckboxSelect.displayName = 'ExampleCheckboxSelectWithValue';

export const CountrySelect = withValue(BaseCountrySelect);
CountrySelect.displayName = 'ExampleCountrySelectWithValue';

export const RadioSelect = withValue(BaseRadioSelect);
RadioSelect.displayName = 'ExampleRadioSelectWithValue';
