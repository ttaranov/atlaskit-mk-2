// @flow

import type { ElementConfig } from 'react';
import Group from '../Group';

export type SortableGroupProps = {
  ...ElementConfig<typeof Group>,
  /** A unique identifier for the group. Required for drag and drop and for analytics. */
  id: string,
  /** Styling to apply to the DroppableGroup. The SortableSection children css prop can
   *  be passed through here if you opt not to wrap SortableGroups with a wrapper.
   */
  innerStyle?: { [cssProp: string]: any },
};
