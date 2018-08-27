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
import { Observable, Observer } from 'rxjs';
import { generatePreview, isPreviewGenerated } from '../domain/preview';

export interface MediaFileListViewerProps {
  readonly context: Context;

  readonly selectedItem: MediaViewerItem;
  readonly list: Array<MediaViewerItem>;

  readonly collectionName?: string;

  readonly MediaViewer: MediaViewerConstructor;
  readonly mediaViewerConfiguration?: MediaViewerConfig;
  readonly basePath: string;

  readonly onClose?: () => void;
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

    const config = {
      ...mediaViewerConfiguration,
      isPreviewGenerated: isPreviewGenerated(MediaViewer),
      generatePreview: generatePreview(MediaViewer),
    };

    const {
      config: { authProvider },
    } = context;

    this.state = {
      mediaViewer: new MediaViewer({
        ...config,
        assets: {
          basePath: basePath,
        },
        fetchToken: fetchToken(authProvider, collectionName),
      }),
    };
  }

  componentDidMount(): void {
    const { context, selectedItem, list, collectionName } = this.props;
    const {
      config: { authProvider },
    } = context;
    const { mediaViewer } = this.state;

    mediaViewer.on('fv.close', this.onClose);

    const filesToProcess = list.filter(item => item.type === 'file'); // for now we only support files

    const erroredObservable = (file: MediaViewerItem) => {
      return Observable.create((observer: Observer<any>) => {
        // a media item with no processingStatus will be treated as error downstream
        // so we will be able to provide the correct error handling
        observer.next({
          details: {
            id: file.id,
          },
        });
        observer.complete();
      });
    };

    const errorAwareObservableFromFile = (file: MediaViewerItem) => {
      const provider = context.getMediaItemProvider(
        file.id,
        file.type,
        collectionName,
      );
      return provider
        .observable()
        .catch(() => erroredObservable(file))
        .map(item => item as FileItem);
    };

    const observableFileItems = filesToProcess.map(
      errorAwareObservableFromFile,
    );

    this.state = {
      subscription: Observable.zip(...observableFileItems).subscribe({
        next: fileItems => {
          const filesWithKeys = fileItems.map((file, index) => ({
            ...file,
            occurrenceKey: filesToProcess[index].occurrenceKey,
          }));

          authProvider().then(({ baseUrl }) => {
            const files = MediaFileAttributesFactory.fromFileItemList(
              filesWithKeys,
              baseUrl,
            );
            mediaViewer.setFiles(files);

            const id = MediaFileAttributesFactory.getUniqueMediaViewerId(
              selectedItem,
            );
            mediaViewer.open({ id });
          });
        },
      }),
      mediaViewer,
    };
  }

  componentWillUnmount(): void {
    const { mediaViewer, subscription } = this.state;
    if (subscription) {
      subscription.unsubscribe();
    }
    mediaViewer.off('fv.close', this.onClose);
  }

  render(): JSX.Element {
    return <div />;
  }

  private onClose = () => {
    const { onClose } = this.props;
    const { subscription } = this.state;
    if (subscription) {
      subscription.unsubscribe();
    }
    if (onClose) {
      onClose();
    }
  };
}
