// @flow

import type { Pick } from '../../../common/types';
import type { SectionProps } from '../Section/types';

export type MenuSectionProps = Pick<
  SectionProps,
  ['id', 'children', 'parentId', 'alwaysShowScrollHint'],
>;
