// @flow

import type { ElementConfig } from 'react';
import Group from '../../presentational/Group';

export type SortableGroupProps = {
  ...$Exact<ElementConfig<typeof Group>>,
  /** A unique identifier for the group that will be used as the droppableId for drag and drop. Also used for analytics. */
  id: string,
  /** Styling to apply to the DroppableGroup. The SortableSection children css prop can
   *  be passed through here if you opt not to wrap SortableGroups with a wrapper.
   */
  innerStyle?: { [cssProp: string]: any },
};
