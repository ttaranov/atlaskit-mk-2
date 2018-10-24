// @flow

import type { ElementConfig } from 'react';
import Group from '../Group';

export type SortableGroupProps = {
  ...ElementConfig<typeof Group>,
  /** A unique identifier for the group. Required for drag and drop and for analytics. */
  id: string,
  /** Styling to apply to the DroppableGroup. The SortableSection children css prop should
   *  be passed through here.
   */
  innerStyle: { [cssProp: string]: any },
};
