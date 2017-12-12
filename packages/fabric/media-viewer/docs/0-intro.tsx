import { md } from '@atlaskit/docs';

export default md`
  # @atlaskit/media-viewer

  ## Installation

  ~~~sh
  yarn add @atlaskit/media-viewer
  ~~~

  ## Using the component

  ~~~js
  import { MediaViewer } from '../src';
  import {
    createStorybookContext,
    defaultCollectionName,
  } from '@atlaskit/media-test-helpers';
  import MediaViewerConstructor from '@atlassian/mediaviewer/lib/mediaviewer.all';

  const context = createStorybookContext();
  const selectedItem = {
    id: 'some-valid-id',
    occurrenceKey: '',
    type: 'file',
  };

  // you want to use here the same pagination you use for the CardList component
  const pageSize = 30;

  const dataSource = {
    collectionName: defaultCollectionName,
  };
  const basePath = 'dist/lib/';

  export default () => (
    <MediaViewer
      pageSize={pageSize}
      context={context}
      selectedItem={selectedItem}
      dataSource={dataSource}
      collectionName={defaultCollectionName}
      MediaViewer={MediaViewerConstructor}
      basePath={basePath}
    />
  );
  ~~~

`;
