import { format as formatBytes } from 'bytes';
import * as dateFormat from 'dateformat';
import * as React from 'react';
import { ReactElement, Component, ReactNode } from 'react';
import ImageIcon from '@atlaskit/icon/glyph/image';
import DynamicTable, { HeadType } from '@atlaskit/dynamic-table';
import { Context, FileItem } from '@atlaskit/media-core';

import { MediaApiFetcher } from '../../tools/fetcher/fetcher';
import {
  MediaListItemThumbnail,
  MediaListItemNameCell,
  MediaListItemName,
  MediaListWrapper,
} from './styled';

export type MediaListProps = {
  readonly items: MediaListItem[];
  readonly isLoading?: boolean;
  readonly onItemClick?: (item: MediaListItem) => void;
};

export type MediaListItem = {
  readonly id: string;
  thumbnailSrc?: string;
  readonly fileName: string;
  readonly timestamp: number;
  readonly size: number;
  readonly progress: number;
  readonly isSelected: boolean;
};

const head: HeadType = {
  cells: [
    { content: 'Name', width: 12, shouldTruncate: true },
    { content: 'Date', width: 5 },
    { content: 'Size', width: 5 },
  ],
};

function formatDate(date: Date): string {
  const mask = 'd mmm yyyy';
  const formattedDate = dateFormat(date, mask);

  if (formattedDate === dateFormat(Date.now(), mask)) {
    return dateFormat(date, 'h:MM TT');
  } else {
    return formattedDate;
  }
}

export function MediaList({
  items,
  isLoading,
  onItemClick,
}: MediaListProps): ReactElement<MediaListProps> {
  const rows = items.map(item => {
    const { thumbnailSrc, fileName, timestamp, size, isSelected } = item;
    // TODO: Use mediaType to render right placeholder (image, video, etc)
    const thumbnail = thumbnailSrc ? (
      <MediaListItemThumbnail src={thumbnailSrc} />
    ) : (
      <ImageIcon label="" size="large" />
    );
    const onClick = onItemClick ? () => onItemClick(item) : undefined;

    return {
      onClick,
      cells: [
        {
          content: (
            <MediaListItemNameCell>
              {thumbnail}
              <MediaListItemName>{fileName}</MediaListItemName>
              {isSelected ? '*' : ''}
            </MediaListItemNameCell>
          ),
        },
        { content: formatDate(new Date(timestamp)) },
        { content: formatBytes(size, { decimalPlaces: 1 }) },
      ],
    };
  });

  return (
    <MediaListWrapper>
      <DynamicTable
        defaultPage={0}
        head={head}
        rows={rows}
        onSetPage={() => {}}
        onSort={() => {}}
        isLoading={isLoading}
      />
    </MediaListWrapper>
  );
}

export type MediaListItemsProps = {
  readonly context: Context;
  readonly collectionName: string;
  readonly selectedItemIds: string[];

  children: (
    props: { items: MediaListItem[]; isLoading: boolean },
  ) => ReactNode;
};

export type MediaListItemsState = {
  items: MediaListItem[];
  isLoading: boolean;
};

export class MediaListItems extends Component<
  MediaListItemsProps,
  MediaListItemsState
> {
  state: MediaListItemsState = {
    items: [],
    isLoading: true,
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
                fileName: item.details.name,
                timestamp: item.insertedAt,
                size: item.details.size,
                progress: 1.0,
                isSelected: false,
              };
            });

            this.setState({ items, isLoading: false });
          });
      });
  }

  render() {
    const { selectedItemIds } = this.props;
    const { items, isLoading } = this.state;
    return (
      <div>
        {this.props.children({
          items: items.map(item => ({
            ...item,
            isSelected: selectedItemIds.indexOf(item.id) >= 0,
          })),
          isLoading,
        })}
      </div>
    );
  }
}
