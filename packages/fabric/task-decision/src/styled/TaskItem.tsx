// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { gridSize, colors } from '@atlaskit/theme';

// tslint:disable-next-line:variable-name
export const CheckBoxWrapper = styled.span`
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  position: relative;
  align-self: start;
  margin: 2px ${gridSize()}px 0 0;

  & > input[type='checkbox'] {
    position: absolute;
    outline: none;
    margin: 0;
    opacity: 0;
    left: 0;
    top: 50%;
    transform: translateY(-50%);

    + label {
      box-sizing: border-box;
      display: block;
      position: relative;
      width: 100%;
      cursor: pointer;

      &::after {
        background: ${colors.N0};
        background-size: 16px;
        border-radius: 3px;
        border-style: solid;
        border-width: 1px;
        border-color: ${colors.N50};
        box-sizing: border-box;
        content: '';
        height: 16px;
        left: 50%;
        position: absolute;
        transition: border-color 0.2s ease-in-out;
        top: 8px;
        width: 16px;
        transform: translate(-50%, -50%);
      }
    }
    &:not([disabled]) + label:hover::after {
      background: ${colors.N30};
      transition: border 0.2s ease-in-out;
    }
    &[disabled] + label {
      opacity: 0.5;
    }
    &:checked {
      + label::after {
        background: url(data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPg0KICA8cmVjdCB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjMDA1MkNDIj48L3JlY3Q+DQogIDxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik05LjM3NCA0LjkxNEw1LjQ1NiA4LjgzMmEuNzY5Ljc2OSAwIDAgMS0xLjA4OCAwTDIuNjI2IDcuMDkxYS43NjkuNzY5IDAgMSAxIDEuMDg4LTEuMDg5TDQuOTEyIDcuMmwzLjM3NC0zLjM3NGEuNzY5Ljc2OSAwIDEgMSAxLjA4OCAxLjA4OCI+PC9wYXRoPg0KPC9zdmc+)
          no-repeat 0 0;
        background-size: 16px;
        border: 0;
        border-color: transparent;
        border-radius: 0; /* FS-1392 */
      }
      &:not([disabled]) + label:hover::after {
        background: url(data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPg0KICA8cmVjdCB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHJ4PSIyIiBmaWxsPSIjMDc0N0E2Ij48L3JlY3Q+DQogIDxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik05LjM3NCA0LjkxNEw1LjQ1NiA4LjgzMmEuNzY5Ljc2OSAwIDAgMS0xLjA4OCAwTDIuNjI2IDcuMDkxYS43NjkuNzY5IDAgMSAxIDEuMDg4LTEuMDg5TDQuOTEyIDcuMmwzLjM3NC0zLjM3NGEuNzY5Ljc2OSAwIDEgMSAxLjA4OCAxLjA4OCI+PC9wYXRoPg0KPC9zdmc+)
          no-repeat 0 0;
        background-size: 16px;
      }
    }
  }
`;
