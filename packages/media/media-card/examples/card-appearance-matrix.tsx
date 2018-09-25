import * as React from 'react';
import {
  Matrix,
  createStorybookContext,
  defaultCollectionName as collectionName,
} from '@atlaskit/media-test-helpers';

import { Card, UrlPreviewIdentifier, FileIdentifier } from '../src';

const context = createStorybookContext();
const genericUrlIdentifier: UrlPreviewIdentifier = {
  mediaItemType: 'link',
  url: 'https://atlassian.com',
};

const fileIdentifier: FileIdentifier = {
  mediaItemType: 'file',
  id: 'fd4c4672-323a-4b6c-8326-223169e2a13e',
  collectionName,
};

// file cards
const smallFileCard = (
  <Card context={context} identifier={fileIdentifier} appearance="small" />
);
const imageFileCard = <Card context={context} identifier={fileIdentifier} />;

// link cards
const smallLinkCard = (
  <Card
    context={context}
    identifier={genericUrlIdentifier}
    appearance="small"
    dimensions={{ width: '200px' }}
  />
);
const linkCardImage = (
  <Card
    context={context}
    identifier={genericUrlIdentifier}
    appearance="image"
  />
);
const horizontalLinkCard = (
  <Card
    context={context}
    identifier={genericUrlIdentifier}
    appearance="horizontal"
  />
);
const squareLinkCard = (
  <Card
    context={context}
    identifier={genericUrlIdentifier}
    appearance="square"
  />
);

export default () => (
  <div style={{ margin: '40px' }}>
    <h1>Appearance matrix</h1>
    <Matrix>
      <thead>
        <tr>
          <td />
          <td>small</td>
          <td>image</td>
          <td>horizontal</td>
          <td>square</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>File Cards</td>
          <td>
            <div>{smallFileCard}</div>
          </td>
          <td>
            <div>{imageFileCard}</div>
          </td>
          <td>No design implemented</td>
          <td>No design implemented</td>
        </tr>
        <tr>
          <td>
            <div>Link Cards</div>
          </td>
          <td>
            <div>{smallLinkCard}</div>
          </td>
          <td>
            <div>{linkCardImage}</div>
          </td>
          <td>
            <div>{horizontalLinkCard}</div>
          </td>
          <td>
            <div>{squareLinkCard}</div>
          </td>
        </tr>
      </tbody>
    </Matrix>
  </div>
);
