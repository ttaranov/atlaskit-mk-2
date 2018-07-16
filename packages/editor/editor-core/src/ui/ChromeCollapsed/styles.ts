import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, InputHTMLAttributes, ComponentClass } from 'react';
import { akEditorSubtleAccent } from '../../styles';
import {
  akBorderRadius,
  akColorN50,
  akColorN300,
} from '@atlaskit/util-shared-styles';

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
    padding-top: 12px;
    padding-bottom: 12px;
    font-size: 14px;
    width: 100%;
    font-weight: 400;
    line-height: 1.42857142857143;
    letter-spacing: -0.005em;
    color: ${akColorN300};

    &:hover {
      border-color: ${akColorN50};
      cursor: text;
    }
  }
`;
