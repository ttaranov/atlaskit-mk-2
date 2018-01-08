import { md } from '@atlaskit/docs';

export default md`
  A Markdown to ProseMirror Node parser.

  ## Using the library

  Use the component in your React app as follows:

  ~~~js
  import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
  const transformer = new MarkdownTransformer(schema);
  transfomer.parse(markdown);
  ~~~
`;
