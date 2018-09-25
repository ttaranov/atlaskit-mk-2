import * as React from 'react';
import {
  Matrix,
  createStorybookContext,
  videoUrlPreviewId,
  audioUrlPreviewId,
  imageUrlPreviewId,
  docUrlPreviewId,
  unknownUrlPreviewId,
  videoFileId,
  audioFileId,
  imageFileId,
  docFileId,
  unknownFileId,
} from '@atlaskit/media-test-helpers';

import { Card } from '../src';

const context = createStorybookContext();
// link cards
const videoLinkCard = <Card context={context} identifier={videoUrlPreviewId} />;
const imageLinkCard = <Card context={context} identifier={imageUrlPreviewId} />;
const audioLinkCard = <Card context={context} identifier={audioUrlPreviewId} />;
const docLinkCard = <Card context={context} identifier={docUrlPreviewId} />;
const unknownLinkCard = (
  <Card context={context} identifier={unknownUrlPreviewId} />
);

// file cards
const videoFileCard = <Card context={context} identifier={videoFileId} />;
const imageFileCard = <Card context={context} identifier={imageFileId} />;
const audioFileCard = <Card context={context} identifier={audioFileId} />;
const docFileCard = <Card context={context} identifier={docFileId} />;
const unknownFileCard = <Card context={context} identifier={unknownFileId} />;

export default () => (
  <div style={{ margin: '40px' }}>
    <h1>Media type matrix</h1>
    <Matrix>
      <thead>
        <tr>
          <td />
          <td>File Cards</td>
          <td>Link Cards</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>video</td>
          <td>
            <div>{videoFileCard}</div>
          </td>
          <td>
            <div>{videoLinkCard}</div>
          </td>
        </tr>
        <tr>
          <td>image</td>
          <td>
            <div>{imageFileCard}</div>
          </td>
          <td>
            <div>{imageLinkCard}</div>
          </td>
        </tr>
        <tr>
          <td>audio</td>
          <td>
            <div>{audioFileCard}</div>
          </td>
          <td>
            <div>{audioLinkCard}</div>
          </td>
        </tr>
        <tr>
          <td>doc</td>
          <td>
            <div>{docFileCard}</div>
          </td>
          <td>
            <div>{docLinkCard}</div>
          </td>
        </tr>
        <tr>
          <td>unknown</td>
          <td>
            <div>{unknownFileCard}</div>
          </td>
          <td>
            <div>{unknownLinkCard}</div>
          </td>
        </tr>
      </tbody>
    </Matrix>
  </div>
);
