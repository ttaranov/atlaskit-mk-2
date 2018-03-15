import { md } from '@atlaskit/docs';

export default md`
  # Editor-Bitbucket-Transformer

  ## Installation

  ~~~sh
  npm install @atlaskit/editor-bitbucket-transformer
  ~~~

  ## Using the library

  Use the encoder with editor-bitbucket-transformer as follows:

  ~~~js
  import { BitbucketTransformer } from '@atlaskit/editor-bitbucket-transformer';
  import { bitbucketSchema as schema } from '@atlaskit/editor-common';

  const serializer = new BitbucketTransformer(schema);
  // To encode editor content as markdown
  serializer.encode(editorContent);
  // To convert HTML to editor content
  serializer.parse(html);
  ~~~
`;
