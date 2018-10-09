import styled from 'styled-components';

import * as React from 'react';
import { colors, borderRadius } from '@atlaskit/theme';

import Editor from './../src/editor';

import {
  akEditorCodeBackground,
  akEditorCodeBlockPadding,
  akEditorCodeFontFamily,
} from '../src/styles';

export const Wrapper: any = styled.div`
  height: 500px;
`;
Wrapper.displayName = 'Wrapper';

export const TitleInput: any = styled.input`
  border: none;
  outline: none;
  font-size: 2.07142857em;
  margin: 0 0 21px;
  padding: 0;

  &::placeholder {
    color: ${colors.N80};
  }
`;
TitleInput.displayName = 'TitleInput';

export const Content: any = styled.div`
  padding: 0 20px;
  height: 100%;
  background: #fff;
  box-sizing: border-box;

  & .ProseMirror {
    & pre {
      font-family: ${akEditorCodeFontFamily};
      background: ${akEditorCodeBackground};
      padding: ${akEditorCodeBlockPadding};
      border-radius: ${borderRadius()}px;
    }
  }
`;
Content.displayName = 'Content';

export type Props = {};
export type State = { disabled: boolean };

export default function Example() {
  return (
    <Wrapper>
      <Content>
        <Editor appearance="full-page" />
      </Content>
    </Wrapper>
  );
}
