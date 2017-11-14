/* @flow */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  AkSearchDrawer,
  AkSearch,
  AkNavigationItem,
  AkNavigationItemGroup,
} from '@atlaskit/navigation';

import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';

import * as fs from '../../utils/fs';
import type { Directory } from '../../types';

const LinkComponent = ({ href, children, onClick, className }) => (
  <Link className={className} onClick={onClick} to={href}>
    {children}
  </Link>
);

const NavItem = ({ dirId, id, closeDrawer }) => (
  <AkNavigationItem
    onClick={closeDrawer}
    href={`/mk-2/packages/${dirId}/${id}`}
    linkComponent={LinkComponent}
    text={fs.titleize(id)}
  />
);

const SearchDrawer = ({
  isOpen,
  closeDrawer,
  searchDrawerValue,
  updateSearchValue,
  SearchItems,
  packages,
}: {
  isOpen: boolean,
  closeDrawer: () => mixed,
  searchDrawerValue: string,
  updateSearchValue: (e: SyntheticInputEvent<*>) => mixed,
  packages: Directory,
}) => (
  <AkSearchDrawer
    backIcon={<ArrowLeftIcon label="go back" />}
    isOpen={isOpen}
    key="search"
    onBackButton={closeDrawer}
    primaryIcon={<AtlassianIcon label="AtlasKit" />}
  >
    <AkSearch
      value={searchDrawerValue}
      onInput={updateSearchValue}
      onKeyDown={() => {}}
    >
      {fs.getDirectories(packages.children).reduce((acc, dir) => {
        const initialItems = fs.getDirectories(dir.children);
        const sanitizedValue = searchDrawerValue.toLowerCase();
        if (
          sanitizedValue.length > 0 &&
          new RegExp(`^${sanitizedValue}`).test(dir.id)
        ) {
          return acc.concat(
            <AkNavigationItemGroup title={dir.id} key={dir.id}>
              {initialItems.map(({ id }) => (
                <NavItem dirId={dir.id} id={id} closeDrawer={closeDrawer} />
              ))}
            </AkNavigationItemGroup>,
          );
        }
        const Items = initialItems.reduce((acc, { id }) => {
          if (id.includes(sanitizedValue)) {
            return acc.concat(
              <NavItem
                dirId={dir.id}
                id={id}
                closeDrawer={closeDrawer}
                key={id}
              />,
            );
          }
          return acc;
        }, []);
        if (Items.length > 0) {
          return acc.concat(
            <AkNavigationItemGroup title={dir.id} key={dir.id}>
              {Items}
            </AkNavigationItemGroup>,
          );
        }
        return acc;
      }, [])}
    </AkSearch>
  </AkSearchDrawer>
);

export default SearchDrawer;
