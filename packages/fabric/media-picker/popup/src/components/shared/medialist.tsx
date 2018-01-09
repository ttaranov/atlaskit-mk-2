import * as React from 'react';
import { ReactElement, Component, ReactNode } from 'react';

import DynamicTable, { HeadType } from '@atlaskit/dynamic-table';
import { smallImage } from '@atlaskit/media-test-helpers';

import { MediaListItemThumbnail, MediaListItemNameCell } from './styled';

export type MediaListProps = {
  readonly items: MediaListItem[];
};

export type MediaListItem = {
  readonly thumbnailSrc: string;
  readonly fileName: string;
  readonly timestamp: number;
  readonly size: number;
  readonly progress: number;
  readonly isSelected: boolean;
};

const head: HeadType = {
  cells: [
    { content: 'Name', width: 8 },
    { content: 'Date', width: 2 },
    { content: 'Size', width: 2 },
  ],
};

export function MediaList({
  items,
}: MediaListProps): ReactElement<MediaListProps> {
  const rows = items.map(({ thumbnailSrc, fileName, timestamp, size }) => ({
    cells: [
      {
        content: (
          <MediaListItemNameCell>
            <MediaListItemThumbnail src={thumbnailSrc} />
            <span>{fileName}</span>
          </MediaListItemNameCell>
        ),
      },
      { content: new Date(timestamp).toLocaleDateString() },
      { content: size },
    ],
  }));
  return (
    <div>
      <h1>Media List</h1>
      <DynamicTable
        defaultPage={0}
        head={head}
        rows={rows}
        onSetPage={() => {}}
        onSort={() => {}}
      />
    </div>
  );
}

export type MediaListItemsProps = {
  children: (props: { items: MediaListItem[] }) => ReactNode;
};

export class MediaListItems extends Component<MediaListItemsProps> {
  // TODO: retrieve items and pass to children;
  render() {
    return <div>{this.props.children({ items: dummyItems })}</div>;
  }
}

const dummyItems: MediaListItem[] = [
  {
    thumbnailSrc: smallImage,
    fileName: 'scotty-simpson.png',
    timestamp: Date.now(),
    size: 123123,
    progress: 1.0,
    isSelected: false,
  },
  {
    thumbnailSrc: smallImage,
    fileName: 'teams-working.jpg',
    timestamp: Date.now(),
    size: 345345,
    progress: 0.5,
    isSelected: true,
  },
];
