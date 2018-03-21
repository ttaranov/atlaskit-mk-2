import * as React from 'react';
import Button from '@atlaskit/button';
import { MediaItemType } from '@atlaskit/media-core';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
  createStorybookContext,
  docFileId,
} from '@atlaskit/media-test-helpers';
import { MediaViewer } from '../src/index';

const context = createStorybookContext();
const selectedItem = {
  type: 'file' as MediaItemType,
  id: docFileId.id,
  occurrenceKey: 'testOccurrenceKey',
};
const dataSource = { list: [selectedItem] };

export type State = {
  isOpen: boolean;
};

// try channel="media", etc?
function doStuff(a, b, c) {
  console.log('---', a, b, c);
}

export default class Example extends React.Component<{}, State> {
  state: State = { isOpen: false };

  render() {
    return (
      <AnalyticsListener onEvent={doStuff}>
        <div>
          <Button onClick={() => this.setState({ isOpen: true })}>
            Preview an unsupported item
          </Button>
          {this.state.isOpen && (
            <MediaViewer
              featureFlags={{ nextGen: true }}
              MediaViewer={null as any}
              basePath={null as any}
              context={context}
              selectedItem={selectedItem}
              dataSource={dataSource}
              collectionName={docFileId.collectionName}
              onClose={() => this.setState({ isOpen: false })}
            />
          )}
        </div>
      </AnalyticsListener>
    );
  }
}
