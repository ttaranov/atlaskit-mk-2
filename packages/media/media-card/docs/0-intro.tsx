import { md } from '@atlaskit/docs';

export default md`
  # MediaCard

  Exports 3 components:

  1. Card
  2. CardView
  3. CardList

  ## Installation

  ~~~sh
  yarn add @atlaskit/media-card
  ~~~

  ### Note:

  Don't forget to add these polyfills to your product if you want to target older browsers:

  * Array.prototype.find() ([polyfill](https://www.npmjs.com/package/array.prototype.find), [browser support](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find))

  ## Using the component

  **Card**

  ~~~typescript
  import { Card } from '@atlaskit/media-card';
  import { ContextFactory } from '@atlaskit/media-core';

  const context = ContextFactory.create({
    clientId,
    serviceHost,
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
