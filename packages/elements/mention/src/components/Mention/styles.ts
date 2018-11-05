import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { colors } from '@atlaskit/theme';
import { MentionType } from '../../types';

export interface MentionStyleProps {
  mentionType: MentionType;
}

const mentionStyle = {};
mentionStyle[MentionType.SELF] = {
  background: colors.B400,
  border: 'transparent',
  text: colors.N20,
};
mentionStyle[MentionType.RESTRICTED] = {
  background: 'transparent',
  border: colors.N500,
  text: colors.N500,
};
mentionStyle[MentionType.DEFAULT] = {
  background: colors.N30A,
  border: 'transparent',
  text: colors.N500,
};

export const MentionStyle: ComponentClass<
  HTMLAttributes<{}> & MentionStyleProps
> = styled.span`
  ${(props: MentionStyleProps) => `
  display: inline;
  background: ${mentionStyle[props.mentionType].background};
  border: 1px solid ${mentionStyle[props.mentionType].border};
  border-radius: 20px;
  color: ${mentionStyle[props.mentionType].text};
  cursor: pointer;
  padding: 0 0.3em 2px 0.23em;
  line-height: 1.714;
  font-size: 1em;
  font-weight: normal;
  word-break: break-word;
`};
`;
