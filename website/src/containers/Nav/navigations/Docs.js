/* @flow */

import React from 'react';
import PageIcon from '@atlaskit/icon/glyph/page';
import type { Directory } from '../../../types';
import * as fs from '../../../utils/fs';
import renderNav from '../renderNav';

export type DocsNavProps = {
  pathname: string,
  docs: Directory,
};

export default function DocsNav({ pathname, docs }: DocsNavProps) {
  const groups = docs.children.map(group => {
    if (group.type === 'file') {
      return {
        items: [
          {
            to: `/docs/${fs.normalize(group.id)}`,
            isSelected: (pathname, to) => pathname.startsWith(to),
            title: fs.titleize(group.id),
            icon: <PageIcon label={`${fs.titleize(group.id)} icon`} />,
          }
        ]
      };
    }

    const children = fs.getFiles(group.children);
    return {
      title: group.id,
      items: children.map(doc => {
        return {
          to: `/docs/${group.id}/${fs.normalize(doc.id)}`,
          isSelected: (pathname, to) => pathname.startsWith(to),
          title: fs.titleize(doc.id),
          icon: <PageIcon label={`${fs.titleize(doc.id)} icon`} />,
        };
      }),
    };
  });

  return <div>{renderNav(groups, pathname)}</div>;
}
