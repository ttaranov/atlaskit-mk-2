/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';

export const PredefinedAvatarsWrapper = styled.div`
  display: flex;

  .show-more-button {
    width: 40px;
    height: 40px;
    border-radius: 20px;

    align-items: center;
    justify-content: center;

    margin: 0;
    padding: 0;
  }
`;
