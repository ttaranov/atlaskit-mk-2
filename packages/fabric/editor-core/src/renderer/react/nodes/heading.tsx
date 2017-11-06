import * as React from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export default function Heading(props: { level: HeadingLevel } & React.Props<any>) {
  const { level, children } = props;
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
  }
}
