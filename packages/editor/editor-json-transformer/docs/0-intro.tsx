import { md } from '@atlaskit/docs';

export default md`
  # Editor-JSON-Transformer

  ## Installation

  ~~~sh
  npm install @atlaskit/editor-json-transformer
  ~~~

  ## Using the library

  Use the component in your React app as follows:

  ~~~js
  import { JSONTransformer } from '@atlaskit/editor-json-transformer';
  const serializer = new BitbucketTransformer(schema);
  serializer.encode(editorContent);
  ~~~
`;
