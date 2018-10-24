import * as React from 'react';
import { colors } from '@atlaskit/theme';
import styled from 'styled-components';

// tslint:disable-next-line:variable-name
const StyledAnchor = styled.a`
  color: ${colors.B400};

  &:hover {
    color: ${colors.B300};
    text-decoration: underline;
  }
`;

export default function Link(
  props: { children?: any; href: string; target?: string } & React.Props<any>,
) {
  const { href, target } = props;

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
