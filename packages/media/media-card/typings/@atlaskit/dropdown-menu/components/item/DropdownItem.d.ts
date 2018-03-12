import { ComponentType } from 'react';
import Item, {
  ItemProps,
  WithItemClickProps,
  WithItemFocusProps,
} from '@atlaskit/item';

declare const DropdownItem: ComponentType<
  ItemProps & WithItemClickProps & WithItemFocusProps
>;

export default DropdownItem;
