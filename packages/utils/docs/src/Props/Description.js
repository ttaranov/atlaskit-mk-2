/* @flow */

import * as React from 'react';

export default function ReadmeDescription({ children }: { children: React.Node }) {
  const style = { marginTop: 12 };

  return typeof children === 'string'
    ? <p>{children}</p>
    : <div style={style}>{children}</div>;
}
