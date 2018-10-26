import memoizeOne from 'memoize-one';
import { ClearIndicator } from './ClearIndicator';
import { MultiValue } from './MultiValue';
import { Option } from './Option';
import { Placeholder } from './Placeholder';
import { SingleValue } from './SingleValue';

/**
 * Memoize getComponents to avoid rerenders.
 */
export const getComponents = memoizeOne(
  (multi?: boolean, anchor?: React.ComponentType<any>) => {
    if (anchor) {
      return {
        Control: anchor,
      };
    } else {
      return {
        MultiValue,
        DropdownIndicator: null,
        SingleValue,
        ClearIndicator: multi ? null : ClearIndicator,
        Placeholder,
        Option: Option,
      };
    }
  },
);
