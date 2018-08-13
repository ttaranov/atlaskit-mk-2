import * as React from 'react';
import { ComponentClass, HTMLAttributes } from 'react';
import styled from 'styled-components';

import { akEditorFullPageMaxWidth } from '@atlaskit/editor-common';
import SizeDetector from '@atlaskit/size-detector';

import { BreakoutProvider } from '../src';
import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/table-overflow.adf.json';

const Wrapper: ComponentClass<HTMLAttributes<HTMLDivElement>> = styled.div`
  max-width: ${akEditorFullPageMaxWidth}px;
  margin: 0 auto;
`;

export default function Example() {
  return (
    <SizeDetector
      containerStyle={{
        height: 0,
        borderStyle: 'none',
      }}
    >
      {({ width }) => (
        <BreakoutProvider value={width}>
          <Wrapper>
            <Renderer document={document} />
          </Wrapper>
        </BreakoutProvider>
      )}
    </SizeDetector>
  );
}
