/* @flow */

import React, { type Node } from 'react';
import { Link } from 'react-router-dom';
import { AkNavigationItem } from '@atlaskit/navigation';

type RouterLinkProps = {
  children: Node,
  href: string,
  className?: string,
  replace?: boolean,
}

const RouterLink = ({ children, href, replace, className }: RouterLinkProps) => (
  <Link to={href} replace={replace} className={className} style={{ color: 'inherit' }}>
    {children}
  </Link>
);

export const RouterNavigationItem = (props: any) => (
  <AkNavigationItem linkComponent={RouterLink} {...props} />
);

export const ExternalNavigationItem = (props: any) => (
  <AkNavigationItem {...props} target="_new" />
);
