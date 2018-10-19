import memoizeOne from 'memoize-one';
import { ControlProps } from 'react-select/lib/components/Control';
import { UserOption } from '../types';
import { UserMultiValueLabel } from './UserMultiValueLabel';
import { UserMultiValueRemove } from './UserMultiValueRemove';

export const getComponents = memoizeOne(
  (anchor?: React.ComponentType<ControlProps<UserOption>>) => {
    if (anchor) {
      return {
        MultiValueLabel: UserMultiValueLabel,
        MultiValueRemove: UserMultiValueRemove,
        Control: anchor,
      };
    } else {
      return {
        MultiValueLabel: UserMultiValueLabel,
        MultiValueRemove: UserMultiValueRemove,
      };
    }
  },
);
