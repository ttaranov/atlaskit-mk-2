import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import {
  akColorB400,
  akColorN20,
  akColorN30A,
  akColorN500,
} from '@atlaskit/util-shared-styles';
import { MentionType } from '../../types';

export interface MentionStyleProps {
  mentionType: MentionType;
}

const mentionStyle = {};
mentionStyle[MentionType.SELF] = {
  background: akColorB400,
  border: 'transparent',
  text: akColorN20,
};
mentionStyle[MentionType.RESTRICTED] = {
  background: 'transparent',
  border: akColorN500,
  text: akColorN500,
};
mentionStyle[MentionType.DEFAULT] = {
  background: akColorN30A,
  border: 'transparent',
  text: akColorN500,
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
