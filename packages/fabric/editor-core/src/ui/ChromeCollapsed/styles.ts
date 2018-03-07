import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, InputHTMLAttributes, ComponentClass } from 'react';
import { akEditorSubtleAccent } from '../../styles';
import { akBorderRadius, akColorN50 } from '@atlaskit/util-shared-styles';

export const Input: ComponentClass<
  InputHTMLAttributes<{}> & { innerRef?: any }
> = styled.input`
  /* Normal .className gets overridden by input[type=text] hence this hack to produce input.className */
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
