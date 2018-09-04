import * as React from 'react';
import Icon from '@atlaskit/icon';

const customGlyph = () => (
  <svg viewBox="0 0 24 24">
    <path
      d="M6 16V9h-.5a1 1 0 0 1 0-2H7a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0zm12 1h-2a1 1 0 1 1 0-2h2v-2l-1-.001A.999.999 0 1 1 17 11h1V9h-2a1 1 0 1 1 0-2h2c1.103 0 2 .896 2 2v2c0 .364-.098.705-.269 1 .171.294.269.636.269 1v2c0 1.103-.897 2-2 2zm-5 0h-3a1 1 0 0 1-1-1v-3c0-1.103.897-2 2-2h1V9h-2a1 1 0 0 1 0-2h2c1.103 0 2 .896 2 2v2a2.001 2.001 0 0 1-2 1.999h-1V15h2a1 1 0 1 1 0 2z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export default ({ label }) => (
  <Icon glyph={customGlyph} label={label} size="medium" />
);
