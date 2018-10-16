// @flow

import React, { Component } from 'react';
import { gridSize as gridSizeFn } from '@atlaskit/theme';
import type { WordmarkProps } from './types';

const gridSize = gridSizeFn();

// Extract-react-types looks for the first react class in the file which won't work with SFCs
// eslint-disable-next-line no-unused-vars
class FakeClassForDocs extends Component<WordmarkProps> {}

// Wordmark
const Wordmark = ({ wordmark: WordmarkLogo }: WordmarkProps) => (
  <div
    css={{
      lineHeight: 0,
      // -2px here to account for the extra space at the top of a MenuSection
      // for the scroll hint.
      paddingBottom: gridSize * 3.5 - 2,
      paddingLeft: gridSize * 2,
      paddingTop: gridSize,
    }}
  >
    <WordmarkLogo />
  </div>
);

export default Wordmark;
