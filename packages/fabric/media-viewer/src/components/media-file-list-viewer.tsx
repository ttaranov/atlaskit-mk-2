import * as React from 'react';
import { Component } from 'react';
import { Context, FileItem } from '@atlaskit/media-core';
import { Subscription } from 'rxjs/Subscription';
import { fetchToken } from '../domain/fetch-token';
import { MediaFileAttributesFactory } from '../domain/media-file-attributes';
import {
  MediaViewerConstructor,
  MediaViewerInterface,
  MediaViewerConfig,
} from '../mediaviewer';
import { MediaViewerItem } from './media-viewer';
import { Observable } from 'rxjs';

export interface MediaFileListViewerProps {
  readonly context: Context;

  readonly selectedItem: MediaViewerItem;
  readonly list: Array<MediaViewerItem>;

  readonly collectionName?: string;

  readonly MediaViewer: MediaViewerConstructor;
  readonly mediaViewerConfiguration?: MediaViewerConfig;
  readonly basePath: string;

  readonly onClose?: () => void;
  readonly onLoadingError?: (error: Error) => void;
}

export interface MediaListFileViewerState {
  readonly subscription?: Subscription;
  readonly mediaViewer: MediaViewerInterface;
}

export class MediaFileListViewer extends Component<
  MediaFileListViewerProps,
  MediaListFileViewerState
> {
  constructor(props: MediaFileListViewerProps) {
    super(props);

    const {
      context,
      collectionName,
      basePath,
      MediaViewer,
      mediaViewerConfiguration,
    } = props;
    const { config: { authProvider } } = context;

    this.state = {
      mediaViewer: new MediaViewer({
        ...mediaViewerConfiguration,
        assets: {
          basePath: basePath,
        },
        fetchToken: fetchToken(authProvider, collectionName),
      }),
    };
  }

  componentDidMount(): void {
    const { context, selectedItem, list, collectionName, onClose, onLoadingError } = this.props;
    const { config } = context;
    const { serviceHost } = config;
    const { mediaViewer } = this.state;

    if (onClose) {
      mediaViewer.on('fv.close', onClose);
    }

    const filesToProcess = list.filter(item => item.type === 'file'); // for now we only support files

    const observableFileItems = filesToProcess
      .map(file =>
        context.getMediaItemProvider(file.id, file.type, collectionName),
      )
      .map(provider => provider.observable().map(item => item as FileItem));

    this.state = {
      subscription: Observable.zip(...observableFileItems).subscribe({
        next: fileItems => {
          const filesWithKeys = fileItems.map((file, index) => ({
            ...file,
            occurrenceKey: filesToProcess[index].occurrenceKey,
          }));

          const files = MediaFileAttributesFactory.fromFileItemList(
            filesWithKeys,
            serviceHost,
          );
          mediaViewer.setFiles(files);

          const id = MediaFileAttributesFactory.getUniqueMediaViewerId(
            selectedItem,
          );
          mediaViewer.open({ id });
        },
        error: (err) => {
          if (onLoadingError) {
            onLoadingError(err);
          }
        }
      }),
      mediaViewer,
    };
  }

  componentWillUnmount(): void {
    const { onClose } = this.props;
    const { mediaViewer, subscription } = this.state;

    if (subscription) {
      subscription.unsubscribe();
    }
    if (onClose) {
      mediaViewer.off('fv.close', onClose);
    }
  }

  render(): JSX.Element {
    return <div />;
  }
}
