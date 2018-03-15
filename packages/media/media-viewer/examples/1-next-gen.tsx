import * as React from 'react';
import { MediaViewer } from '../src/newgen/media-viewer';
import Button from '@atlaskit/button';
import { MediaType } from '@atlaskit/media-core';
import {
  createStorybookContext,
  docFileId,
} from '@atlaskit/media-test-helpers';

type State = {
  isOpen: boolean;
};

const context = createStorybookContext();
const data = {
  type: 'file' as MediaType,
  id: docFileId,
  occurrenceKey: 'asdasd',
};

export default class Example extends React.Component<{}, State> {
  state: State = { isOpen: false };

  render() {
    return (
      <div>
        <Button onClick={() => this.setState({ isOpen: true })}>
          Preview an unsupported item
        </Button>
        {this.state.isOpen && (
          <MediaViewer
            context={context}
            data={data}
            onClose={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}
