/* @flow */

import React, { type ComponentType } from 'react';
import sentenceCase from 'sentence-case';
import BitbucketReposIcon from '@atlaskit/icon/glyph/bitbucket/repos';
import ComponentIcon from '@atlaskit/icon/glyph/component';
import renderNav from '../renderNav';
import type { Directory } from '../../../types';
import * as fs from '../../../utils/fs';

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
    return {
      title: group.id,
      items: packages.map(pkg => {
        return {
          to: `/packages/${group.id}/${pkg.id}/`,
          isSelected: (pathname, to) => pathname.startsWith(to),
          title: fs.titleize(pkg.id),
          icon: <BitbucketReposIcon label={`${fs.titleize(pkg.id)} icon`} />,
        };
      }),
    };
  });

  return <div>{renderNav([{ items: [packagesList] }, ...groups], props.pathname)}</div>;
}
