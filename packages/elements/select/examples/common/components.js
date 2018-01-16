// @flow
import { withValue } from 'react-value';
import AkSelect, {
  CheckboxSelect as AkCheckboxSelect,
  RadioSelect as AkRadioSelect,
} from '../../src';

// simple handler for onChange and value in examples
export const Select = withValue(AkSelect);
Select.displayName = 'ExampleSelectWithValue';

export const CheckboxSelect = withValue(AkCheckboxSelect);
CheckboxSelect.displayName = 'ExampleCheckboxSelectWithValue';

export const RadioSelect = withValue(AkRadioSelect);
RadioSelect.displayName = 'ExampleRadioSelectWithValue';
