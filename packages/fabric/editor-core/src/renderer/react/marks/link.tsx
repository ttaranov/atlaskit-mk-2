import * as React from 'react';

export default function Link(props: { children?: any; href: string; target?: string; } & React.Props<any>) {
  const {
    href,
    target = '_blank',
  } = props;

  const anchorProps: any = {
    href,
    target,
    title: href,
  };

  if (target === '_blank') {
    anchorProps.rel = 'noreferrer noopener';
  }

  return (
    <a {...anchorProps}>{props.children}</a>
  );
}
