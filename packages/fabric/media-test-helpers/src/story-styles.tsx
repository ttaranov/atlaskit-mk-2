/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { TableHTMLAttributes, ClassAttributes } from 'react';

export const Matrix = styled.table`
  thead {
    td {
      text-align: center;
      font-weight: bold;
      font-size: 20px;
    }
  }

  tbody {
    td {
      padding: 25px 10px;
    }
  }

  td {
    margin: auto;
    text-align: center;
    vertical-align: middle;

    &:first-child {
      font-weight: bold;
      font-size: 20px;
    }

    > div {
      display: flex;
      justify-content: center;
      text-align: left;
    }
  }
`;
