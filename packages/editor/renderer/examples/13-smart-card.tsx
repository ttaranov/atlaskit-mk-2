import * as React from 'react';
import { ComponentClass, HTMLAttributes } from 'react';
import styled from 'styled-components';

import { akEditorFullPageMaxWidth } from '@atlaskit/editor-common';
import SizeDetector from '@atlaskit/size-detector';
import { Provider as CardProvider } from '@atlaskit/smart-card';

import { BreakoutProvider } from '../src';
import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/smart-card.adf.json';

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
          <CardProvider>
            <Wrapper>
              <Renderer document={document} />
            </Wrapper>
          </CardProvider>
        </BreakoutProvider>
      )}
    </SizeDetector>
  );
}
