/* @flow */

import React from 'react';
import sentenceCase from 'sentence-case';
import HomeFilledIcon from '@atlaskit/icon/glyph/home';
import ComponentIcon from '@atlaskit/icon/glyph/components';
import PageIcon from '@atlaskit/icon/glyph/page';
import type { Doc } from '../../../types';
import { removeSuffix, removeNumericPrefix, basename } from '../../../utils/path';
import renderNav from '../renderNav';
import type { List } from '../../../utils/examples';

const formatDocName = name => sentenceCase(removeSuffix(removeNumericPrefix(basename(name))));

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

export function processDocs(docs: Array<Doc>) {
  return {
    title: 'Guides',
    items: docs.map(item => {
      const slug = item.filePath.split('docs/')[1];
      return {
        to: `/docs/${removeSuffix(slug)}`,
        title: formatDocName(item.filePath),
        icon: <PageIcon label={`${formatDocName(item.filePath)} icon`} />,
      };
    }),
  };
}

export function processPatterns(patterns: Array<List>) {
  return {
    title: 'Patterns',
    items: patterns.map(({ link, name }) => ({
      to: `/patterns/${link}`,
      title: name,
    })),
  };
}

export type DefaultNavProps = {
  pathname: string,
  docs: Array<Doc>,
  patterns: Array<List>
}

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
