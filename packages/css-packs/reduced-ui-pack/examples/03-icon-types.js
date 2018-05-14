// @flow

import React from 'react';
// eslint-disable-next-line
import icons from '!!raw-loader!../src/icons-sprite.svg';

import iconIds from '../src/internal/iconIds';

// eslint-disable-next-line react/no-danger
const Spritemap = () => <div dangerouslySetInnerHTML={{ __html: icons }} />;

export default () => (
  <div>
    <link
      rel="stylesheet"
      href="https://unpkg.com/@atlaskit/reduced-ui-pack@8.8.0/dist/bundle.css"
    />
    <Spritemap />
    <style>
      {`
            .icon-example {
              display: flex;
              align-items: center;
              font-family: monospace;
            }
            .icon-example > svg {
              margin-right: 16px;
            }
          `}
    </style>
    {iconIds.map(iconId => (
      <p className="icon-example">
        <svg focusable="false" className="ak-icon">
          <use xlinkHref={`#${iconId}`} />
        </svg>
        {`<svg focusable="false"><use xlink:href="#${iconId}" /></svg>`}
      </p>
    ))}
  </div>
);
