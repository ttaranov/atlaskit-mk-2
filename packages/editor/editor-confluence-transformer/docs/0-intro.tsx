import { md } from '@atlaskit/docs';

export default md`
  # editor-confluence-transformer

  ## Installation

  ~~~sh
  npm install @atlaskit/editor-confluence-transformer
  ~~~

  ## Using the library

  Use the component in your React app as follows:

  ~~~js
  import { ConfluenceTransformer } from '@atlaskit/editor-confluence-transformer';
  import { confluenceSchema as schema } from '@atlaskit/editor-common';

  const serializer = new ConfluenceTransformer(schema);
  // To encode editor content as markdown
  serializer.encode(editorContent);
  // To convert HTML to editor content
  serializer.parse(html);
  ~~~
`;
