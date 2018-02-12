// StyledComponentClass and React are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes } from 'react';
import {
  akBorderRadius,
  akColorN500,
  akTypographyMixins,
} from '@atlaskit/util-shared-styles';

// tslint:disable:next-line variable-name
export const MentionListErrorStyle = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: white;
  color: ${akColorN500};
  border: 1px solid #fff;
  border-radius: ${akBorderRadius};
`;

export const GenericErrorVisualStyle = styled.div`
  height: 108px;
  margin-bottom: 8px;
  margin-top: 36px;
  width: 83px;
`;

// TODO: Figure out why the themed css function is causing type errors when passed prop children
export const MentionListErrorHeadlineStyle = styled.div`
  ${akTypographyMixins.h400 as any};
  margin-bottom: 8px;
`;

export const MentionListAdviceStyle = styled.div`
  margin-bottom: 48px;
`;
