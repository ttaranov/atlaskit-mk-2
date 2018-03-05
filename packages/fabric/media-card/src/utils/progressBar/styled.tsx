/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { borderRadius } from '../../styles';

export const ProgressWrapper = styled.div`
  ${borderRadius} z-index: 30;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.3);

  .progressBar {
    width: 0%;
    height: 3px;
    background-color: white;
  }
`;
