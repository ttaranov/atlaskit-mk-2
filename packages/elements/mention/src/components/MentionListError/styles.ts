import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { borderRadius, colors, typography } from '@atlaskit/theme';

// tslint:disable:next-line variable-name
export const MentionListErrorStyle: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: white;
  color: ${colors.N500};
  border: 1px solid #fff;
  border-radius: ${borderRadius()}px;
`;

export const GenericErrorVisualStyle: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  height: 108px;
  margin-bottom: 8px;
  margin-top: 36px;
  width: 83px;
`;

// TODO: Figure out why the themed css function is causing type errors when passed prop children
export const MentionListErrorHeadlineStyle: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  ${typography.h400()};
  margin-bottom: 8px;
`;

export const MentionListAdviceStyle: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  margin-bottom: 48px;
`;
