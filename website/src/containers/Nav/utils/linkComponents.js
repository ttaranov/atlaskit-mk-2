/* @flow */

import React, { type Node } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { AkNavigationItem, AkNavigationItemGroup } from '@atlaskit/navigation';
import renderNav from './renderNav';

type RouterLinkProps = {
  children: Node,
  href: string,
  className?: string,
  replace?: boolean,
  subNav?: any,
  isSelected: boolean,
  pathname: string,
};

const SubNavWrapper = styled.div`padding: 0 0 0 ${() => gridSize() * 2}px;`;

export function isSubNavExpanded(to: string, pathname: string): boolean {
  const lastSeg = to.split('/').pop();
  return (
    pathname.startsWith(to) &&
    (!!pathname.match(new RegExp(`\/${lastSeg}\/`)) ||
      !!pathname.match(new RegExp(`\/${lastSeg}$`)))
  );
}

const RouterLink = ({
  children,
  href,
  replace,
  className,
  subNav,
  isSelected,
  pathname,
}: RouterLinkProps) => {
  return (
    <div key={pathname}>
      <Link to={href} replace={replace} className={className} style={{ color: 'inherit' }}>
        {children}
      </Link>
      {subNav &&
        isSubNavExpanded(href, pathname) && (
          <SubNavWrapper>{renderNav(subNav, pathname)}</SubNavWrapper>
        )}
    </div>
  );
};

export const RouterNavigationItem = (props: any) => (
  <AkNavigationItem
    linkComponent={linkProps => (
      <RouterLink pathname={props.pathname} subNav={props.subNav} {...linkProps} />
    )}
    {...props}
  />
);

export const ExternalNavigationItem = (props: any) => <AkNavigationItem {...props} target="_new" />;
