import styled from 'styled-components';

import * as React from 'react';
import { akColorN80 } from '@atlaskit/util-shared-styles';

import Editor from './../src/editor';

import {
  akEditorCodeBackground,
  akEditorCodeBlockPadding,
  akEditorCodeFontFamily,
} from '../src/styles';

import { akBorderRadius } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const TitleInput = styled.input`
  border: none;
  outline: none;
  font-size: 2.07142857em;
  margin: 0 0 21px;
  padding: 0;

  &::placeholder {
    color: ${akColorN80};
  }
`;
TitleInput.displayName = 'TitleInput';

// tslint:disable-next-line:variable-name
export const Content = styled.div`
  padding: 0 20px;
  height: 100%;
  background: #fff;
  box-sizing: border-box;

  & .ProseMirror {
    & pre {
      font-family: ${akEditorCodeFontFamily};
      background: ${akEditorCodeBackground};
      padding: ${akEditorCodeBlockPadding};
      border-radius: ${akBorderRadius};
    }
  }
`;
Content.displayName = 'Content';

export type Props = {};
export type State = { disabled: boolean };

export default function Example() {
  return (
    <Content>
      <Editor appearance="full-page" />
    </Content>
  );
}
