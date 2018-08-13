import * as React from 'react';
import { ComponentClass, HTMLAttributes } from 'react';
import styled from 'styled-components';

import {
  akEditorFullPageMaxWidth,
  ProviderFactory,
} from '@atlaskit/editor-common';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';
import SizeDetector from '@atlaskit/size-detector';

import { BreakoutProvider } from '../src';
import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/table-layout.adf.json';

const Wrapper: ComponentClass<HTMLAttributes<HTMLDivElement>> = styled.div`
  max-width: ${akEditorFullPageMaxWidth}px;
  margin: 0 auto;
`;

const mediaProvider = storyMediaProviderFactory();
const providerFactory = ProviderFactory.create({ mediaProvider });

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
            <Renderer dataProviders={providerFactory} document={document} />
          </Wrapper>
        </BreakoutProvider>
      )}
    </SizeDetector>
  );
}
