import * as React from 'react';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { MediaViewer, MediaViewerItem } from '../src/index';

const context = createStorybookContext();

const selected: MediaViewerItem = {
  type: 'file',
  id: '9ab19d51-e0f4-403e-8fb2-3ab4b6a77504',
  occurrenceKey: '8351fc2f-ecf8-4afb-a909-a9234ea4a445',
};

export default class Example extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <MediaViewer
          featureFlags={{ nextGen: true }}
          MediaViewer={null as any}
          basePath={null as any}
          context={context}
          selectedItem={selected}
          dataSource={{ collectionName: defaultCollectionName }}
          collectionName={defaultCollectionName}
          onClose={() => this.setState({ selectedItem: undefined })}
        />
      </div>
    );
  }
}
