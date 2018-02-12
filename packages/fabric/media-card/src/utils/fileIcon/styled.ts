/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes } from 'react';
import { size } from '../../styles';

export const FileTypeIcon = styled.div`
  float: left;
  margin-right: 6px;
  position: relative;
  top: 1px;
  img {
    ${size('12px !important')};
  }
`;
