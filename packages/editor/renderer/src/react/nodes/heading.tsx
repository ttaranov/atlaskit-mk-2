import * as React from 'react';
import { getText } from '../../utils';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export default function Heading(
  props: {
    level: HeadingLevel;
    content: any[];
    disableHeadingIDs?: boolean;
  } & React.Props<any>,
) {
  const { level, children, content } = props;
  const headerId = !props.disableHeadingIDs ? getHeaderId(content) : undefined;

  switch (level) {
    case 1:
      return <h1 id={headerId}>{children}</h1>;
    case 2:
      return <h2 id={headerId}>{children}</h2>;
    case 3:
      return <h3 id={headerId}>{children}</h3>;
    case 4:
      return <h4 id={headerId}>{children}</h4>;
    case 5:
      return <h5 id={headerId}>{children}</h5>;
    case 6:
      return <h6 id={headerId}>{children}</h6>;
  }
}

const getHeaderId = (contents): string => {
  return contents
    .reduce((acc, node) => {
      let headingText = getText(node) || '';
      return acc.concat(headingText);
    }, '')
    .replace(/ /g, '-');
};
