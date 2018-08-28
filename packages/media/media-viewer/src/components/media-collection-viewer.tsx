import * as React from 'react';
import { Component } from 'react';
import {
  Context,
  MediaCollectionProvider,
  isError,
} from '@atlaskit/media-core';
import { Subscription } from 'rxjs/Subscription';
import { fetchToken } from '../domain/fetch-token';
import { MediaFileAttributesFactory } from '../domain/media-file-attributes';
import {
  MediaViewerConstructor,
  MediaViewerInterface,
  MediaViewerConfig,
} from '../mediaviewer';
import { MediaViewerItem } from './media-viewer';
import { generatePreview, isPreviewGenerated } from '../domain/preview';

export interface MediaCollectionViewerProps {
  readonly context: Context;

  readonly selectedItem?: MediaViewerItem;
  readonly collectionName: string;

  readonly pageSize?: number;
  readonly MediaViewer: MediaViewerConstructor;
  readonly mediaViewerConfiguration?: MediaViewerConfig;
  readonly basePath: string;

  readonly onClose?: () => void;
}

export interface MediaCollectionViewerState {
  readonly provider: MediaCollectionProvider;
  readonly mediaViewer: MediaViewerInterface;
}

export class MediaCollectionViewer extends Component<
  MediaCollectionViewerProps,
  MediaCollectionViewerState
> {
  private subscription: Subscription | null;

  static readonly defaultPageSize = 10;

  constructor(props: MediaCollectionViewerProps) {
    super(props);

    const {
      context,
      collectionName,
      basePath,
      MediaViewer,
      mediaViewerConfiguration,
    } = props;
    const {
      config: { authProvider },
    } = context;
    const pageSize =
      this.props.pageSize || MediaCollectionViewer.defaultPageSize;

    const config = {
      ...mediaViewerConfiguration,
      isPreviewGenerated: isPreviewGenerated(MediaViewer),
      generatePreview: generatePreview(MediaViewer),
    };

    this.state = {
      provider: context.getMediaCollectionProvider(collectionName, pageSize),
      mediaViewer: new MediaViewer({
        ...config,
        assets: {
          basePath: basePath,
        },
        fetchToken: fetchToken(authProvider, collectionName),
      }),
    };
    this.subscription = null;
  }

  componentDidMount(): void {
    const { context, selectedItem } = this.props;
    const {
      config: { authProvider },
    } = context;
    const { mediaViewer, provider } = this.state;

    mediaViewer.on('fv.close', this.onClose);
    mediaViewer.on('fv.changeFile', this.loadNextPageIfRequired);

    this.subscription = provider.observable().subscribe({
      next: value => {
        if (!isError(value)) {
          authProvider().then(({ baseUrl }) => {
            const files = MediaFileAttributesFactory.fromMediaCollection(
              value,
              baseUrl,
            );
            if (files.length > 0) {
              if (mediaViewer.isOpen()) {
                mediaViewer.setFiles(files, {
                  id: mediaViewer.getCurrent().id,
                });
              } else {
                const id = selectedItem
                  ? MediaFileAttributesFactory.getUniqueMediaViewerId(
                      selectedItem,
                    )
                  : files[0].id;
                mediaViewer.setFiles(files);
                mediaViewer.open({ id });
              }
            }
          });
        }
      },
    });
  }

  componentWillUnmount(): void {
    const { mediaViewer } = this.state;
    this.subscription!.unsubscribe();
    mediaViewer.off('fv.close', this.onClose);
    mediaViewer.off('fv.changeFile', this.loadNextPageIfRequired);
  }

  render(): JSX.Element {
    return <div />;
  }

  private onClose = () => {
    const { onClose } = this.props;
    this.subscription!.unsubscribe();
    if (onClose) {
      onClose();
    }
  };

  private loadNextPageIfRequired = () => {
    const { mediaViewer, provider } = this.state;
    if (mediaViewer.isShowingLastFile()) {
      provider.loadNextPage();
    }
  };
}
