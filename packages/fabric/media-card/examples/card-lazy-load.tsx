import * as React from 'react';
import * as scrollParent from 'scrollparent';
import {
  createStorybookContext,
  genericFileId,
} from '@atlaskit/media-test-helpers';
import { Card } from '../src';

const context = createStorybookContext();

class Example extends React.Component<{}, {}> {
  handleMount = el => {
    if (el) {
      const parent = scrollParent(el);
      parent.scrollTo(0, 9999);
    }
  };

  render() {
    return (
      <div ref={this.handleMount}>
        <div
          style={{
            background:
              'linear-gradient(to bottom, rgba(226,226,226,1) 0%, rgba(254,254,254,1) 100%)',
          }}
        >
          <div style={{ height: '125vh' }} />
          <Card context={context} identifier={genericFileId} />
          <div style={{ height: '125vh' }} />
        </div>
      </div>
    );
  }
}

export default () => <Example />;
