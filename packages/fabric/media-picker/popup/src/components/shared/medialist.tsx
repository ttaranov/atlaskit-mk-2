import { format } from 'bytes';
import * as React from 'react';
import { ReactElement, Component, ReactNode } from 'react';

import DynamicTable, { HeadType } from '@atlaskit/dynamic-table';
import { smallImage } from '@atlaskit/media-test-helpers';
import { Context, FileItem } from '@atlaskit/media-core';
import { MediaApiFetcher } from '../../tools/fetcher/fetcher';
import {
  MediaListItemThumbnail,
  MediaListItemNameCell,
  MediaListItemName,
} from './styled';

export type MediaListProps = {
  readonly items: MediaListItem[];
};

export type MediaListItem = {
  readonly id: string;
  thumbnailSrc: string;
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
            <MediaListItemName>{fileName}</MediaListItemName>
          </MediaListItemNameCell>
        ),
      },
      { content: new Date(timestamp).toLocaleDateString() },
      { content: format(size, { decimalPlaces: 1 }) },
    ],
  }));
  return (
    <DynamicTable
      defaultPage={0}
      head={head}
      rows={rows}
      onSetPage={() => {}}
      onSort={() => {}}
    />
  );
}

export type MediaListItemsProps = {
  context: Context;
  collectionName: string;
  children: (props: { items: MediaListItem[] }) => ReactNode;
};

export type MediaListItemsState = {
  items: MediaListItem[];
};

export class MediaListItems extends Component<
  MediaListItemsProps,
  MediaListItemsState
> {
  state: MediaListItemsState = {
    items: [],
  };

  componentDidMount() {
    const { collectionName, context } = this.props;
    const fetcher = new MediaApiFetcher();

    context.config
      .authProvider({
        collectionName,
      })
      .then(auth => {
        fetcher
          .getRecentFiles(context.config.serviceHost, auth, 30, 'desc')
          .then(recentItems => {
            const items = recentItems.contents.map(item => {
              const id = item.id;
              const mediaItem: FileItem = { type: 'file', details: { id } };

              context
                .getDataUriService(collectionName)
                .fetchImageDataUri(mediaItem, {
                  width: 32,
                  height: 32,
                  // allowAnimated
                })
                .then(dataUri => {
                  const { items } = this.state;
                  const item = items.filter(item => item.id === id)[0];

                  item.thumbnailSrc = dataUri;

                  this.setState({ items });
                });

              return {
                id,
                thumbnailSrc: smallImage,
                fileName: item.details.name,
                timestamp: item.insertedAt,
                size: item.details.size,
                progress: 1.0,
                isSelected: false,
              };
            });

            this.setState({ items });
          });
      });
  }

  render() {
    const { items } = this.state;
    return <div>{this.props.children({ items })}</div>;
  }
}
