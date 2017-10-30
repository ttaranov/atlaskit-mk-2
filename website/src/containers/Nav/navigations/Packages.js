/* @flow */

import React, { type ComponentType } from 'react';
import sentenceCase from 'sentence-case';
import BitbucketReposIcon from '@atlaskit/icon/glyph/bitbucket/repos';
import PageIcon from '@atlaskit/icon/glyph/page';
import ComponentIcon from '@atlaskit/icon/glyph/component';
import CodeIcon from '@atlaskit/icon/glyph/code';
import renderNav from '../utils/renderNav';
import type { Directory, File, NavGroupItem } from '../../../types';
import * as fs from '../../../utils/fs';
import allPackages, { packageNames } from '../../../packages';
import { OLD_WEBSITE_URL, NEW_WEBSITE_PREFIX } from '../../../utils/constants';
import { packageUrl, packageDocUrl, packageExampleUrl } from '../../../utils/url';

export function buildSubNavGroup(
  children: Array<File>,
  groupTitle: string,
  url: (id: string) => string,
  Icon: ComponentType<*>
): { title?: string, items: Array<NavGroupItem> } | null {
  if (!children || !children.length) return null;
  return (
    children.filter(item => !item.id.startsWith('_')).reduce((acc, item) => {
      acc.items.push({
        to: url(fs.normalize(item.id)),
        title: fs.titleize(item.id),
        icon: <Icon label={`${fs.titleize(item.id)} icon`} />,
      });
      return acc;
    },
    { title: groupTitle, items: [] })
  );
}

const getItemDetails = (pkg: Directory, group: Directory, navigateOut?: boolean) => {
  const docs = fs.getById(fs.getDirectories(pkg.children) || [], 'docs');
  const examples = fs.getById(fs.getDirectories(pkg.children) || [], 'examples');
  const docItems = fs
    .getFiles(docs && docs.children && docs.children.length ? docs.children : [])
    .slice(1);
  const exampleItems = fs.getFiles(examples.children || []);

  const items = [];

  if (!navigateOut) {
    const docsSubnav = buildSubNavGroup(docItems, 'Docs', packageDocUrl.bind(null, group.id, pkg.id), PageIcon);
    const examplesSubnav = buildSubNavGroup(
      exampleItems,
      'Examples',
      packageExampleUrl.bind(null, group.id, pkg.id),
      CodeIcon
    );

    if (docsSubnav) items.push(docsSubnav);
    if (examplesSubnav) items.push(examplesSubnav);
  }

  return {
    to: navigateOut ? `/packages/${group.id}/${pkg.id}` : packageUrl(group.id, pkg.id),
    isSelected: (pathname, to) => pathname === to,
    title: fs.titleize(pkg.id),
    icon: <BitbucketReposIcon label={`${fs.titleize(pkg.id)} icon`} />,
    items,
  };
};

const getItem = (packages: Array<Directory>, group: Directory, navigateOut: boolean) => {
  const findablePkgs: { [key: string]: Object } = packages.reduce((acc, pkg) => {
    acc[pkg.id] = pkg;
    return acc;
  }, {});

  return packageNames.map(name => {
    const pkg = findablePkgs[allPackages[name].key];
    if (pkg) {
      return getItemDetails(pkg, group, navigateOut);
    } else {
      return {
        to: `${OLD_WEBSITE_URL}components/${allPackages[name].key}`,
        external: true,
        title: allPackages[name].name,
        icon: <BitbucketReposIcon label={`${allPackages[name].name} icon`} />,
      };
    }
  });
};

const packagesList = {
  to: '/packages',
  title: 'All packages',
  icon: <ComponentIcon label="All packages icon" />,
};

export type PackagesNavProps = {
  pathname: string,
  packages: Directory,
  navigateOut: boolean,
};

const fakeOldSiteGroups = (dirs: Array<Directory>, navigateOut: boolean) =>
  dirs.filter(group => group.id === 'elements').map(group => {
    const packages = fs.getDirectories(group.children);
    return {
      title: group.id,
      items: getItem(packages, group, navigateOut),
    };
  });

const standardGroups = (dirs: Array<Directory>) =>
  dirs.map(group => {
    const packages = fs.getDirectories(group.children);
    return {
      title: group.id,
      items: packages.map(pkg => getItemDetails(pkg, group)),
    };
  });

export default function PackagesNav(props: PackagesNavProps) {
  const { packages, pathname, navigateOut } = props;
  const dirs = fs.getDirectories(packages.children);

  const groups = navigateOut ? fakeOldSiteGroups(dirs, navigateOut) : standardGroups(dirs);

  return <div>{renderNav([{ items: [packagesList] }, ...groups], pathname)}</div>;
}
