import { md } from '@atlaskit/docs';

export default md`
  # Editor-Jira-Transformer

  ## Installation

  ~~~sh
  npm install @atlaskit/editor-jira-transformer
  ~~~

  ## Using the library

  Use the component in your React app as follows:

  ~~~js
  import { JiraTransformer } from '@atlaskit/editor-jira-transformer';

  const serializer = new JiraTransformer(schema);
  // To encode editor content as markdown
  serializer.encode(editorContent);
  // To convert HTML to editor content
  serializer.parse(html);
  ~~~
`;
