import * as React from 'react';
import { toClass } from 'recompose';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { AkNavigationItem } from '@atlaskit/navigation';
import renderNav from './renderNav';
import { Link } from '../../../components/WrappedLink';

type RouterLinkProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
  isSelected: boolean;
  onClick: (e: Event) => void;
  pathname: string;
  replace?: boolean;
  subNav?: any;
};

const SubNavWrapper = styled.div`
  padding: 0 0 0 ${() => gridSize() * 4}px;
`;

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
  onClick,
  isSelected,
  pathname,
}: RouterLinkProps) => {
  return (
    <div key={pathname}>
      <Link
        className={className}
        onClick={onClick}
        replace={replace}
        style={{ color: 'inherit' }}
        to={href}
        isSelected={isSelected}
      >
        {children}
      </Link>
      {subNav &&
        isSubNavExpanded(href, pathname) && (
          <SubNavWrapper>
            {renderNav(subNav, { pathname, onClick })}
          </SubNavWrapper>
        )}
    </div>
  );
};

export const RouterNavigationItem = (props: any) => {
  return (
    <AkNavigationItem
      linkComponent={toClass(linkProps => (
        <RouterLink
          onClick={props.onClick}
          pathname={props.pathname}
          subNav={props.subNav}
          {...linkProps}
        />
      ))}
      {...props}
    />
  );
};

export const ExternalNavigationItem = (props: any) => (
  <AkNavigationItem {...props} />
);
