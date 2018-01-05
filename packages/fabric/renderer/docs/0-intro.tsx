import * as React from 'react';
import { md, Example, code } from '@atlaskit/docs';

export default md`
# Renderer

## Installation

\`\`\`sh
npm install @atlaskit/renderer
\`\`\`

## Using the component

Use the component in your React app as follows:

${code`
import { ReactRenderer } from '@atlaskit/renderer';
ReactDOM.render(<ReactRenderer document={DOCUMENT} />, container);
`}

## Example

${(
  <Example
    Component={require('../examples/1-with-providers').default}
    title="With Providers"
    source={require('!!raw-loader!../examples/1-with-providers')}
  />
)}

## Using transformers with the renderer
You will need to use a transformer to convert your own storage format into the ADF before you pass it to the renderer.
We have provided helper utility to simplify this process:

${code`
import { BitbucketTransformer } from '@atlaskit/editor-bitbucket-transformer';
import { ReactRenderer, ADFEncoder } from '@atlaskit/renderer';

const adfEncoder = new ADFEncoder(schema => new BitbucketTransformer(schema));
const document = adfEncoder.encode(DOCUMENT);

ReactDOM.render(<ReactRenderer document={document} />, container);
`}

## Polyfills

Don't forget to add these polyfills to your product build if you're using emoji or mentions in the renderer and you want to target older browsers:

 * Promise ([polyfill](https://www.npmjs.com/package/es6-promise), [browser support](http://caniuse.com/#feat=promises))
 * Fetch API ([polyfill](https://www.npmjs.com/package/whatwg-fetch), [browser support](http://caniuse.com/#feat=fetch))
 * URLSearchParams API ([polyfill](https://www.npmjs.com/package/url-search-params), [browser support](http://caniuse.com/#feat=urlsearchparams))
 * Element.closest ([polyfill](https://www.npmjs.com/package/element-closest), [browser support](http://caniuse.com/#feat=element-closest))

`;
