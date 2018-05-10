// @flow

import type { Node } from 'react';

export type RenderProvided = {
  css: {},
};

export type SectionProps = {
  id?: string,
  parentId?: string,
  children: RenderProvided => Node,
};

export type SectionState = {
  traversalDirection: 'down' | 'up' | null,
};
