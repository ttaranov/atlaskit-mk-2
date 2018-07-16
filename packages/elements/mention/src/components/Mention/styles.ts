import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import {
  akColorB400,
  akColorN20,
  akColorN30A,
  akColorN500,
  akFontSizeDefault,
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
  display: inline-block;
  background: ${mentionStyle[props.mentionType].background};
  border: 1px solid ${mentionStyle[props.mentionType].border};
  border-radius: 20px;
  color: ${mentionStyle[props.mentionType].text};
  cursor: pointer;
  padding: 0 4px 2px 3px;
  white-space: nowrap;
  line-height: 16px;
  font-size: ${akFontSizeDefault};
  font-weight: normal;
`};
`;

export const MentionContainer: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: inline-table;
  white-space: nowrap;
`;
