import { md } from '@atlaskit/docs';

export default md`
  # Editor-CQ-Transformer

  ## Installation

  ~~~sh
  npm install @atlaskit/editor-cq-transformer
  ~~~

  ## Using the library

  Use the component in your React app as follows:

  ~~~js
  import { ConfluenceTransformer } from '@atlaskit/editor-cq-transformer';
  import { confluenceSchema as schema } from '@atlaskit/editor-common';

  const serializer = new ConfluenceTransformer(schema);
  // To encode editor content as markdown
  serializer.encode(editorContent);
  // To convert HTML to editor content
  serializer.parse(html);
  ~~~

`;
