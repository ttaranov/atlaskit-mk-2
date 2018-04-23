import * as React from 'react';
import { Component } from 'react';

import { A } from './styled';

export interface HrefProps {
  linkUrl?: string;
  underline?: boolean;
  className?: string;

  [propName: string]: any;
}

export class Href extends Component<HrefProps, {}> {
  render() {
    const {
      linkUrl,
      underline,
      children,
      className,
      ...otherProps
    } = this.props;

    return (
      <A
        {...otherProps}
        underline={underline}
        href={linkUrl}
        className={className}
        target="_blank"
        rel="noopener"
      >
        {children}
      </A>
    );
  }
}
