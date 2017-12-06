import * as React from 'react';
import {
  createStorybookContext,
  defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { CardList } from '../src';

const context = createStorybookContext();
const sampleURLs = [
  'https://instagram.fmel2-1.fna.fbcdn.net/t51.2885-15/s750x750/sh0.08/e35/18013123_289517061492259_5387236423503970304_n.jpg',
  'https://instagram.fmel2-1.fna.fbcdn.net/t51.2885-15/sh0.08/e35/p750x750/17932355_1414135458643877_7397381955274145792_n.jpg',
  'https://instagram.fmel2-1.fna.fbcdn.net/t51.2885-15/e35/17934651_290135948064496_9023380363640045568_n.jpg',
  'https://instagram.fmel2-1.fna.fbcdn.net/t51.2885-15/e35/18013337_1868376446765095_7156944441888997376_n.jpg',
  'https://instagram.fmel2-1.fna.fbcdn.net/t50.2886-16/17993161_923799904389578_6802183987235127296_n.mp4',
  'https://instagram.fmel2-1.fna.fbcdn.net/t51.2885-15/s640x640/sh0.08/e35/18013865_724397224396655_6018996846838415360_n.jpg',
];

const handleAddItem = () => {
  const url = sampleURLs[Math.floor(Math.random() * sampleURLs.length)];
  context
    .getUrlPreviewProvider(url)
    .observable()
    .subscribe(metadata =>
      context.addLinkItem(url, defaultCollectionName, metadata),
    );
};

const handleRefresh = () => {
  context.refreshCollection(defaultCollectionName, 10);
};

const RefreshDemo = (): JSX.Element => {
  // tslint:disable-line:variable-name
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '25%' }}>
        <CardList
          context={context}
          pageSize={10}
          collectionName={defaultCollectionName}
        />
      </div>
      <div style={{ width: '25%' }}>
        <CardList
          context={context}
          pageSize={10}
          collectionName={defaultCollectionName}
          cardAppearance="small"
        />
      </div>
      <div>
        <button onClick={handleAddItem}>Add an item to the collection</button>
        <button onClick={handleRefresh}>Refresh the collection</button>
      </div>
    </div>
  );
};

export default () => <RefreshDemo />;
