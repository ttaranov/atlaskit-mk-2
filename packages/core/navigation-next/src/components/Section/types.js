// @flow

import type { Node } from 'react';

export type RenderProvided = {
  className: string,
  css: {},
};

export type SectionProps = {
  /** A unique ID for this section. */
  id?: string,
  /** The unique ID of the section which is this section's 'parent' in the
   * context of a nested navigation transition. */
  parentId?: string | null,
  /** A component to render the children of this section. It will be provided
   * with a styles object which should be applied to the outermost element to
   * enable transition animations. */
  children: RenderProvided => Node,
  disableTransition?: boolean,
};

export type SectionState = {
  traversalDirection: 'down' | 'up' | null,
};
