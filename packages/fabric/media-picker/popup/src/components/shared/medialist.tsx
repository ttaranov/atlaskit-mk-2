import * as React from 'react';
import { ReactElement } from 'react';

import DynamicTable from '@atlaskit/dynamic-table';

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

export function MediaList({  }: MediaListProps): ReactElement<MediaListProps> {
  return (
    <div>
      <h1>Media List</h1>
      <DynamicTable
        defaultPage={0}
        head={{ cells: [{ content: <div>Hello</div> }] }}
        rows={[{ cells: [{ content: <div>Hello</div> }] }]}
        onSetPage={() => {}}
        onSort={() => {}}
      />
    </div>
  );
}
