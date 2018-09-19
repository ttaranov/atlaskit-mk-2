import * as React from 'react';
import { Component } from 'react';
import { Card, ExternalIdentifier } from '../src';
import {
  createStorybookContext,
  wideImage,
  imageFileId,
} from '@atlaskit/media-test-helpers';

const context = createStorybookContext();
const externalIdentifier: ExternalIdentifier = {
  mediaItemType: 'external',
  dataURI: wideImage,
  name: 'me',
};

class Example extends Component {
  render() {
    return (
      <div>
        <div>
          <h1>External identifier</h1>
          <Card
            context={context}
            identifier={externalIdentifier}
            // dimensions={{
            //   width: 300,
            //   height: 100
            // }}
          />
        </div>
        <div>
          <h1>File identifier</h1>
          <Card context={context} identifier={imageFileId} />
        </div>
      </div>
    );
  }
}

export default () => <Example />;
