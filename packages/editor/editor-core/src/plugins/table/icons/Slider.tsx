import * as React from 'react';
import Icon from '@atlaskit/icon';

const customGlyph = () => (
  <svg viewBox="0 0 24 24">
    <path
      d="M11.17 11a3.001 3.001 0 0 1 5.66 0H20a1 1 0 0 1 0 2h-3.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 0 1 0-2h7.17z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export default ({ label }) => (
  <Icon glyph={customGlyph} label={label} size="medium" />
);
