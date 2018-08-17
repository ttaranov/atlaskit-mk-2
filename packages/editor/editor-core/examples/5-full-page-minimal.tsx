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
import { IntlProvider } from 'react-intl';

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
    color: ${akColorN80};
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
      border-radius: ${akBorderRadius};
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
        <IntlProvider locale="en">
          <Editor appearance="full-page" />
        </IntlProvider>
      </Content>
    </Wrapper>
  );
}
