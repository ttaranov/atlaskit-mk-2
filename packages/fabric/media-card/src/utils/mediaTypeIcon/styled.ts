/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes } from 'react';
import {
  akColorY200,
  akColorP200,
  akColorB300,
} from '@atlaskit/util-shared-styles';

const colors = {
  image: akColorY200,
  audio: akColorP200,
  video: '#ff7143',
  doc: akColorB300,
  unknown: '#3dc7dc',
};

export interface IconWrapperProps {
  type: string;
}

export const IconWrapper = styled.div`
  display: inline-flex;
  color: ${({ type }: IconWrapperProps) => colors[type] || colors.unknown};
`;
