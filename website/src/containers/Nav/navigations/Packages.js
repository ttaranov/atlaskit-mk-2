/* @flow */

import React from 'react';
import sentenceCase from 'sentence-case';
import BitbucketReposIcon from '@atlaskit/icon/glyph/bitbucket/repos';
import ComponentIcon from '@atlaskit/icon/glyph/components';
import renderNav from '../renderNav';
import type { Packages } from '../../../types';

const packagesList = {
  to: '/packages',
  title: 'All packages',
  icon: <ComponentIcon label="All packages icon" />,
};

export type PackagesNavProps = {
  pathname: string,
  packages: Packages,
};

export default function PackagesNav(props: PackagesNavProps) {
  const groups = Object.keys(props.packages).map(group => ({
    title: sentenceCase(group),
    items: props.packages[group].map(pkg => ({
      to: `/packages/${pkg.group}/${pkg.name}/`,
      isSelected: (pathname, to) => pathname.startsWith(to),
      title: pkg.name,
      icon: <BitbucketReposIcon label={`${pkg.name} icon`} />,
    })),
  }));
  return <div>{renderNav([{ items: [packagesList] }, ...groups], props.pathname)}</div>;
}
