import * as React from 'react';
import { ComponentClass, HTMLAttributes } from 'react';
import styled from 'styled-components';

import {
  akEditorFullPageMaxWidth,
  ExtensionHandlers,
} from '@atlaskit/editor-common';
import SizeDetector from '@atlaskit/size-detector';

import { BreakoutProvider } from '../src';
import { default as Renderer } from '../src/ui/Renderer';
import {
  EDITOR_APPS_EXTENSION_TYPE,
  TABS_EXTENSION_KEY,
  TabsApp,
} from '../../editor-core/apps/Tabs';
import { exampleDocument } from '../../editor-core/apps/Tabs/document';

const Wrapper: ComponentClass<HTMLAttributes<HTMLDivElement>> = styled.div`
  max-width: ${akEditorFullPageMaxWidth}px;
  margin: 0 auto;
`;

const extensionHandlers: ExtensionHandlers = {
  [EDITOR_APPS_EXTENSION_TYPE]: (ext, doc) => {
    const { extensionKey, parameters } = ext;

    if (extensionKey === TABS_EXTENSION_KEY) {
      return <TabsApp {...parameters} />;
    }

    return null;
  },
};

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
            <Renderer
              document={exampleDocument}
              extensionHandlers={extensionHandlers}
            />
          </Wrapper>
        </BreakoutProvider>
      )}
    </SizeDetector>
  );
}
