// @flow

import type { ComponentType, ElementConfig } from 'react';

import { HeaderSection, MenuSection } from '../';
import type { ViewData } from '../../src/view-controller/types';

/**
 * Components
 */

export type GroupHeadingProps = {
  text: string,
};

export type SectionHeadingProps = {
  text: string,
};

type CustomComponents = { [string]: ComponentType<any> };

type SharedGroupTypeProps = {
  customComponents?: CustomComponents,
  id: string,
  items: ViewData,
};

export type GroupProps = SharedGroupTypeProps & {
  hasSeparator: boolean,
  heading?: string,
};

export type SectionProps = SharedGroupTypeProps & {
  alwaysShowScrollHint?: boolean,
  nestedGroupKey?: string,
  parentId?: string | null,
  shouldGrow?: boolean,
};

export type HeaderSectionProps = SharedGroupTypeProps &
  ElementConfig<typeof HeaderSection> & {
    nestedGroupKey?: string,
  };

export type MenuSectionProps = SharedGroupTypeProps &
  ElementConfig<typeof MenuSection> & {
    nestedGroupKey?: string,
  };

export type ItemsRendererProps = {
  customComponents?: CustomComponents,
  items: ViewData,
};
