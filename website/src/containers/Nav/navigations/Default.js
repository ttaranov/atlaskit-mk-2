/* @flow */

import React from 'react';
import HomeFilledIcon from '@atlaskit/icon/glyph/home-filled';
import ComponentIcon from '@atlaskit/icon/glyph/component';
import PageIcon from '@atlaskit/icon/glyph/page';
import type { Directory } from '../../../types';
import * as fs from '../../../utils/fs';
import renderNav from '../renderNav';

const defaultNavGroups = [
  {
    items: [
      {
        to: '/',
        title: 'Welcome',
        icon: <HomeFilledIcon label="Welcome icon" />,
      },
      {
        to: '/packages',
        title: 'Packages',
        icon: <ComponentIcon label="Packages icon" />,
      },
    ],
  },
];

export function processDocs(docs: Directory) {
  return {
    title: 'Guides',
    items: fs.flatMap(docs, (file, filePath) => {
      return {
        to: `/${fs.normalize(filePath)}`,
        title: fs.titleize(file.id),
        icon: <PageIcon label={`${fs.titleize(file.id)} icon`} />,
      };
    }),
  };
}

export function processPatterns(patterns: Directory) {
  return {
    title: 'Patterns',
    items: fs.flatMap(patterns, (file, filePath) => {
      if (filePath.endsWith('.json')) return null;
      return {
        to: `/patterns/${fs.normalize(file.id)}`,
        title: fs.titleize(file.id),
      };
    }).filter(Boolean),
  };
}

export type DefaultNavProps = {
  pathname: string,
  docs: Directory,
  patterns: Directory,
};

export default function DefaultNav(props: DefaultNavProps) {
  const groups = []
    .concat(defaultNavGroups)
    .concat(processDocs(props.docs))
    .concat(processPatterns(props.patterns));
  return (
    <div>
      {renderNav(groups, props.pathname)}
    </div>
  );
}
