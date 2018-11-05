import { components } from '@atlaskit/select';
import memoizeOne from 'memoize-one';
import { ClearIndicator } from './ClearIndicator';
import { MultiValue } from './MultiValue';
import { Option } from './Option';
import { Placeholder } from './Placeholder';
import { SingleValue } from './SingleValue';
import { ValueContainer } from './ValueContainer';

/**
 * Memoize getComponents to avoid rerenders.
 */
export const getComponents = memoizeOne(
  (multi?: boolean, anchor?: React.ComponentType<any>) => {
    if (anchor) {
      return {
        Control: anchor,
        Option: Option,
      };
    } else {
      return {
        MultiValue,
        DropdownIndicator: null,
        SingleValue,
        ClearIndicator: multi ? null : ClearIndicator,
        Placeholder,
        Option: Option,
        ValueContainer: multi ? ValueContainer : components.ValueContainer,
      };
    }
  },
);
