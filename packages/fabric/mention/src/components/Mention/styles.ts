// StyledComponentClass and React are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes } from 'react';
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

// tslint:disable-next-line:variable-name
export const MentionStyle = styled.span`
  ${(props: MentionStyleProps) => `
  display: table-cell;
  background: ${mentionStyle[props.mentionType].background};
  border: 1px solid ${mentionStyle[props.mentionType].border};
  border-radius: 20px;
  color: ${mentionStyle[props.mentionType].text};
  cursor: pointer;
  padding: 0 4px 2px 3px;
  white-space: nowrap;
  line-height: 16px;
`};
`;

// tslint:disable-next-line:variable-name
export const MentionContainer = styled.span`
  display: inline-table;
  white-space: nowrap;
`;
