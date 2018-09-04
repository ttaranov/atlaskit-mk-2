import * as React from 'react';
import Icon from '@atlaskit/icon';

const customGlyph = () => (
  <svg viewBox="0 0 24 24">
    <defs>
      <path
        d="M10,7 L14,7 L14,6 C14,5.44771525 14.4477153,5 15,5 C15.5522847,5 16,5.44771525 16,6 L16,7 C17.1045695,7 18,7.8954305 18,9 L18,17 C18,18.1045695 17.1045695,19 16,19 L8,19 C6.8954305,19 6,18.1045695 6,17 L6,9 C6,7.8954305 6.8954305,7 8,7 L8,6 C8,5.44771525 8.44771525,5 9,5 C9.55228475,5 10,5.44771525 10,6 L10,7 Z M8,11 L8,17 L16,17 L16,11 L8,11 Z"
        id="path-1"
      />
    </defs>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <mask id="mask-2" fill="white">
        <use xlinkHref="#path-1" />
      </mask>
      <use fill="currentColor" xlinkHref="#path-1" />
      <g mask="url(#mask-2)" fill="#42526E">
        <g transform="translate(0.000000, 2.000000)">
          <rect x="0" y="0" width="24" height="20" />
        </g>
      </g>
    </g>
  </svg>
);

export default ({ label }) => (
  <Icon glyph={customGlyph} label={label} size="medium" />
);
