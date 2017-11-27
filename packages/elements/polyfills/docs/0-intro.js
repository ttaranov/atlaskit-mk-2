// @flow
import React from 'react';
import { md } from '@atlaskit/docs';

export default md`
  Use the logo component to output SVG versions of the company and product logos.

  This package provides the following polyfills

  ${(
    <div style={{ padding: '20px' }}>
      <h3>Object.assign</h3>
      <pre>{"import '@atlaskit/polyfills/object-assign';"}</pre>
      <h3>Array.prototype.includes</h3>
      <pre>{"import '@atlaskit/polyfills/array-prototype-includes';"}</pre>
      <h3>String.prototype.includes</h3>
      <pre>{"import '@atlaskit/polyfills/string-prototype-includes';"}</pre>
    </div>
  )}

`;
