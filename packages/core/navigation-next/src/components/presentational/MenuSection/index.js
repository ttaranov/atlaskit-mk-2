// @flow

import React from 'react';
import { gridSize as gridSizeFn } from '@atlaskit/theme';
import { css as parseCss } from 'emotion';
import Section from '../Section';
import type { MenuSectionProps } from './types';

const gridSize = gridSizeFn();

const MenuSection = ({
  alwaysShowScrollHint = false,
  id,
  children,
  parentId,
}: MenuSectionProps) => (
  <Section
    id={id}
    parentId={parentId}
    alwaysShowScrollHint={alwaysShowScrollHint}
    shouldGrow
  >
    {({ css }) => {
      const menuCss = {
        ...css,
        paddingBottom: gridSize * 1.5,
      };

      return children({
        css: menuCss,
        className: parseCss(menuCss),
      });
    }}
  </Section>
);
export default MenuSection;
