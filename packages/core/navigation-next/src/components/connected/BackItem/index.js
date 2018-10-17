// @flow

import React, { Component } from 'react';
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/arrow-left-circle';
import { gridSize as gridSizeFn } from '@atlaskit/theme';

import { ConnectedItem } from '../';
import type { BackItemProps } from './types';

const gridSize = gridSizeFn();

// Extract-react-types looks for the first react class in the file which won't work with SFCs
// eslint-disable-next-line no-unused-vars
class FakeClassForDocs extends Component<BackItemProps> {}

const BackItem = ({ before: beforeProp, text, ...props }: BackItemProps) => {
  let before = beforeProp;
  if (!before) {
    before = () => (
      <ArrowLeftCircleIcon
        primaryColor="currentColor"
        secondaryColor="inherit"
      />
    );
  }

  return (
    <div css={{ paddingBottom: gridSize * 2 }}>
      <ConnectedItem
        {...props}
        after={null}
        before={before}
        text={text || 'Back'}
      />
    </div>
  );
};

export default BackItem;
