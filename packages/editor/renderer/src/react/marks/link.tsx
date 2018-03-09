import * as React from 'react';
import { akColorB300, akColorB400 } from '@atlaskit/util-shared-styles';
import styled from 'styled-components';

// tslint:disable-next-line:variable-name
const StyledAnchor = styled.a`
  color: ${akColorB400};

  &:hover {
    color: ${akColorB300};
    text-decoration: underline;
  }
`;

export default function Link(
  props: { children?: any; href: string; target?: string } & React.Props<any>,
) {
  const { href, target = '_blank' } = props;

  const anchorProps: any = {
    href,
    target,
    title: href,
  };

  if (target === '_blank') {
    anchorProps.rel = 'noreferrer noopener';
  }

  return <StyledAnchor {...anchorProps}>{props.children}</StyledAnchor>;
}
