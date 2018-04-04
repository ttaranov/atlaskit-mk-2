import * as React from 'react';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { MediaViewer, MediaViewerItem } from '../src/index';

const context = createStorybookContext();

const selected: MediaViewerItem = {
  type: 'file',
  id: '2896d3e5-466a-437e-89ce-0f6cb6a085b0',
  occurrenceKey: '75218381-558f-417f-a77e-b5e7a2615d32',
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
