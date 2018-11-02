import * as React from 'react';
import {
  createStorybookContext,
  youTubeUrlPreviewId,
  spotifyUrlPreviewId,
  soundcloudUrlPreviewId,
  publicTrelloBoardUrlPreviewId,
  twitterUrlPreviewId,
} from '@atlaskit/media-test-helpers';
import { Card } from '../src';

const context = createStorybookContext();

export default () => (
  <div>
    <div>
      <h1>Youtube</h1>
      <Card identifier={youTubeUrlPreviewId} context={context} />
    </div>
    {/* <div>
      <h1></h1>
      <Card identifier={spotifyUrlPreviewId} context={context} />
    </div> */}
    {/* <div>
      <h1></h1>
      <Card identifier={soundcloudUrlPreviewId} context={context} />
    </div>
    <div>
      <h1></h1>
      <Card identifier={twitterUrlPreviewId} context={context} />
    </div>
    <div>
      <h1></h1>
      <Card identifier={publicTrelloBoardUrlPreviewId} context={context} />
    </div> */}
  </div>
);
