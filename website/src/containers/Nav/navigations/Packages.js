/* @flow */

import React, { type ComponentType } from 'react';
import sentenceCase from 'sentence-case';
import BitbucketReposIcon from '@atlaskit/icon/glyph/bitbucket/repos';
import ComponentIcon from '@atlaskit/icon/glyph/component';
import renderNav from '../utils/renderNav';
import whereThis from '../../../whereThis';
import type { Directory } from '../../../types';
import * as fs from '../../../utils/fs';

const getItemDetails = (pkg, group) => ({
  to: `/packages/${group.id}/${pkg.id}/`,
  isSelected: (pathname, to) => pathname.startsWith(to),
  title: fs.titleize(pkg.id),
  icon: <BitbucketReposIcon label={`${fs.titleize(pkg.id)} icon`} />,
})

const getItem = (packages, group) => {
  const findablePkgs: { [key: string]: Object } = packages.reduce((acc, pkg) => {
    acc[pkg.id] = pkg;
    return acc;
  }, {})

  return whereThis.map(data => {
    const pkg = findablePkgs[data.key];
    if (pkg) {
      return getItemDetails(pkg, group)
    } else {
      return {
        to: `https://atlaskit.atlassian.com/components/${data.key}`,
        external: true,
        title: data.name,
        icon: <BitbucketReposIcon label={`${data.name} icon`} />,
      }
    }
  })
}

const packagesList = {
  to: '/packages',
  title: 'All packages',
  icon: <ComponentIcon label="All packages icon" />,
};

export type PackagesNavProps = {
  pathname: string,
  packages: Directory,
};

export default function PackagesNav(props: PackagesNavProps) {
  const dirs = fs.getDirectories(props.packages.children);

  const groups = dirs.map(group => {
    const packages = fs.getDirectories(group.children);
    if (group.id !== 'elements') {
      return {
        title: group.id,
        items: packages.map(pkg => getItemDetails(pkg, group)),
      };
    } else {
      return {
        title: group.id,
        items: getItem(packages, group),
      };
    }
  });

  return <div>{renderNav([{ items: [packagesList] }, ...groups], props.pathname)}</div>;
}
