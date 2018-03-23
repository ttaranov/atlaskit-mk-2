import { md } from '@atlaskit/docs';

export default md`
  # Editor-wikimarkup-Transformer

  ## Installation

  ~~~sh
  npm install @atlaskit/editor-wikimarkup-transformer
  ~~~

  ## Using the library

  Use the component in your React app as follows:

  ~~~js
  import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';
  const transformer = new WikiMarkupTransformer(schema);
  const pmNode = transformer.parse(wikiMarkup);
  ~~~
`;
