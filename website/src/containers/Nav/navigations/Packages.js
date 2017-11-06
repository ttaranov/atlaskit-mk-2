/* @flow */

import React, { type ComponentType } from 'react';
import sentenceCase from 'sentence-case';
import PackageIcon from '@atlaskit/icon/glyph/chevron-right';
import PackageSelectedIcon from '@atlaskit/icon/glyph/chevron-down';
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
  const docs = fs.maybeGetById(fs.getDirectories(pkg.children) || [], 'docs');
  const examples = fs.maybeGetById(fs.getDirectories(pkg.children) || [], 'examples');
  if (!docs) return null;
  if (!examples) return null;

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
    title: fs.titleize(pkg.id),
    icon: <PackageIcon label={`${fs.titleize(pkg.id)} icon`} />,
    iconSelected: <PackageSelectedIcon label={`${fs.titleize(pkg.id)} icon`} />,
    items,
  };
};

const getItem = (packages: Array<Directory>, group: Directory, navigateOut: boolean) => {
  const findablePkgs: { [key: string]: Object } = packages.reduce((acc, pkg) => {
    acc[pkg.id] = pkg;
    return acc;
  }, {});

  return packageNames.reduce((results, name) => {
    const pkg = findablePkgs[allPackages[name].key];
    if (pkg) {
      let details = getItemDetails(pkg, group, navigateOut);
      if (details) return results.concat(details);
    } else {
      return results.concat({
        to: `${OLD_WEBSITE_URL}components/${allPackages[name].key}`,
        external: true,
        title: allPackages[name].name,
        icon: <PackageIcon label={`${allPackages[name].name} icon`} />,
      });
    }
    return results;
  }, []);
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
      items: packages.reduce((items, pkg) => {
        let details = getItemDetails(pkg, group);
        if (details) {
          return items.concat(details);
        } else {
          return items;
        }
      }, []),
    };
  });

export default function PackagesNav(props: PackagesNavProps) {
  const { packages, pathname, navigateOut } = props;
  const dirs = fs.getDirectories(packages.children);

  const groups = navigateOut ? fakeOldSiteGroups(dirs, navigateOut) : standardGroups(dirs);

  return <div>{renderNav([{ items: [packagesList] }, ...groups], pathname)}</div>;
}
