/* @flow */

import React from 'react';
import { AkNavigationItemGroup } from '@atlaskit/navigation';
import { RouterNavigationItem, ExternalNavigationItem } from './linkComponents';
import type { NavGroup } from '../../../types';

export default function renderNav(groups: Array<NavGroup>, pathname: string) {
  return groups.map((group, index) => (
    <AkNavigationItemGroup
      title={group.title}
      key={pathname + index + (group.title || '')}
    >
      {group.items.map(item => {
        // const isAncestor = pathname.includes(item.to) && pathname !== item.to;
        const isSelected = pathname === item.to;
        const icon = isSelected ? item.iconSelected || item.icon : item.icon;

        return item.external ? (
          <ExternalNavigationItem
            key={item.title}
            href={item.to}
            icon={icon}
            text={item.title}
          />
        ) : (
          <RouterNavigationItem
            key={item.title}
            href={item.to}
            icon={icon}
            text={item.title}
            isSelected={isSelected}
            pathname={pathname}
            subNav={item.items}
          />
        );
      })}
    </AkNavigationItemGroup>
  ));
}
