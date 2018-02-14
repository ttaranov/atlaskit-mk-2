// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, InputHTMLAttributes } from 'react';
import { akEditorSubtleAccent } from '../../styles';
import { akBorderRadius, akColorN50 } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const Input = styled.input`
  // Normal .className gets overridden by input[type=text] hence this hack to produce input.className
  input& {
    background-color: white;
    border: 1px solid ${akEditorSubtleAccent};
    border-radius: ${akBorderRadius};
    box-sizing: border-box;
    height: 40px;
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;

    &:hover {
      border-color: ${akColorN50};
      cursor: pointer;
    }
  }
`;
