import { md } from '@atlaskit/docs';

export default md`
  # MediaCard

  Exports 2 components:

  1.  Card
  2.  CardView

  ## Installation

  ~~~sh
  yarn add @atlaskit/media-card
  ~~~

  ### Note:

  Don't forget to add polyfills for fetch, ES6 & ES7 to your product build if you want to target older browsers.
  We recommend the use of [babel-preset-env](https://babeljs.io/docs/plugins/preset-env/) & [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)

  ## Using the component

  **Card**

  ~~~typescript
  import { Card } from '@atlaskit/media-card';
  import { ContextFactory } from '@atlaskit/media-core';

  const context = ContextFactory.create({
    tokenProvider,
  });

  // url preview
  const urlPreviewId = {
    mediaItemType: 'link',
    url: 'https://atlassian.com',
  };

  <Card context={context} identifier={urlPreviewId} />;

  // stored link
  const linkId = {
    mediaItemType: 'link',
    id: 'some-link-id',
    collectionName: 'some-collection-name',
  };

  <Card context={context} identifier={linkId} />;

  // stored file
  const fileId = {
    mediaItemType: 'file',
    id: 'some-file-id',
    collectionName: 'some-collection-name',
  };

  <Card context={context} identifier={fileId} />;
  ~~~
`;
