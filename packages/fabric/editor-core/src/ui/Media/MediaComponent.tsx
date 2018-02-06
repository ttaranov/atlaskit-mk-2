import * as React from 'react';
import {
  Card,
  CardView,
  CardStatus,
  CardDimensions,
  Identifier,
} from '@atlaskit/media-card';
import {
  MediaItemType,
  ContextConfig,
  ContextFactory,
  Context,
  CardDelete,
  CardEventHandler,
  FileDetails,
  ImageResizeMode,
} from '@atlaskit/media-core';
import {
  MediaAttributes,
  CardEventClickHandler,
} from '@atlaskit/editor-common';

import {
  MediaProvider,
  MediaStateManager,
  MediaState,
} from '../../plugins/media';
import { isImage } from '../../utils';

export type Appearance = 'small' | 'image' | 'horizontal' | 'square';

// This is being used by DropPlaceholder now
export const MEDIA_HEIGHT = 125;
export const FILE_WIDTH = 156;

export interface Props extends MediaAttributes {
  mediaProvider?: Promise<MediaProvider>;
  cardDimensions?: CardDimensions;
  onClick?: CardEventClickHandler;
  onDelete?: CardEventHandler;
  resizeMode?: ImageResizeMode;
  appearance?: Appearance;
  stateManagerFallback?: MediaStateManager;
  selected?: boolean;
}

export interface State extends MediaState {
  mediaProvider?: MediaProvider;
  viewContext?: Context;
  linkCreateContext?: Context;
}

/**
 * Map media state status into CardView processing status
 * Media state status is more broad than CardView API so we need to reduce it
 */
function mapMediaStatusIntoCardStatus(state: MediaState): CardStatus {
  switch (state.status) {
    case 'ready':
    case 'unknown':
    case 'unfinalized':
      return 'complete';

    case 'processing':
    case 'preview':
    case 'uploading':
      return 'uploading';

    // default case is to let TypeScript know that this function always returns a string
    case 'error':
    default:
      return 'error';
  }
}

export default class MediaComponent extends React.PureComponent<Props, State> {
  private destroyed = false;

  static defaultProps = {
    selected: false,
  };

  state: State = {
    id: '',
    status: 'unknown',
  };

  componentWillMount() {
    const { mediaProvider } = this.props;

    if (mediaProvider) {
      mediaProvider.then(this.handleMediaProvider);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { mediaProvider } = nextProps;

    if (this.props.mediaProvider !== mediaProvider) {
      if (mediaProvider) {
        mediaProvider.then(this.handleMediaProvider);
      } else {
        this.setState({ mediaProvider });
      }
    }
  }

  componentWillUnmount() {
    this.destroyed = true;

    const { id } = this.props;
    const { mediaProvider } = this.state;

    if (mediaProvider) {
      const { stateManager } = mediaProvider;
      if (stateManager) {
        stateManager.off(id, this.handleMediaStateChange);
      }
    }

    const { stateManagerFallback } = this.props;
    if (stateManagerFallback) {
      stateManagerFallback.off(id, this.handleMediaStateChange);
    }
  }

  render() {
    switch (this.props.type) {
      case 'file':
        return this.renderFile();

      case 'link':
        return this.renderLink();

      default:
        return null;
    }
  }

  private renderLoadingCard(mediaItemType: MediaItemType, url?: string) {
    const { cardDimensions } = this.props;

    return (
      <CardView
        status="loading"
        mediaItemType={mediaItemType}
        dimensions={cardDimensions}
      />
    );
  }

  private renderLink() {
    const { mediaProvider, linkCreateContext } = this.state;
    const {
      id,
      collection,
      cardDimensions,
      onDelete,
      appearance,
      ...otherProps
    } = this.props;
    const hasProviders = mediaProvider && linkCreateContext;

    if (!hasProviders) {
      return this.renderLoadingCard('link');
    }

    const identifier: Identifier = {
      mediaItemType: 'link',
      collectionName: collection,
      id,
    };

    if (id.substr(0, 10) === 'temporary:') {
      const url = id.substr(id.indexOf(':', 11) + 1);
      return this.renderLoadingCard('link', url);
    }

    if (onDelete) {
      (otherProps as any).actions = [CardDelete(onDelete)];
    }

    return (
      <Card
        context={linkCreateContext}
        dimensions={cardDimensions}
        identifier={identifier}
        appearance={appearance || 'horizontal'}
        resizeMode={this.resizeMode}
        {...otherProps as any}
      />
    );
  }

  private renderFile() {
    const { mediaProvider, viewContext } = this.state;
    const { id } = this.props;

    if (!mediaProvider || !viewContext) {
      return this.renderLoadingCard('file');
    }

    if (id.substr(0, 10) === 'temporary:') {
      return this.renderTemporaryFile();
    } else {
      return this.renderPublicFile();
    }
  }

  private renderPublicFile() {
    const { viewContext } = this.state;
    const {
      cardDimensions,
      collection,
      id,
      onDelete,
      onClick,
      selected,
    } = this.props;
    const otherProps: any = {};

    if (onDelete) {
      otherProps.actions = [CardDelete(onDelete)];
    }

    if (onClick) {
      otherProps.onClick = onClick;
    }

    return (
      <Card
        context={viewContext!}
        dimensions={cardDimensions}
        identifier={{
          id,
          mediaItemType: 'file',
          collectionName: collection,
        }}
        selectable={true}
        selected={selected}
        resizeMode={this.resizeMode}
        {...otherProps}
      />
    );
  }

  private renderTemporaryFile() {
    const { thumbnail, fileName, fileSize, fileMimeType, status } = this.state;
    const { onDelete, cardDimensions, appearance, selected } = this.props;

    // Cache the data url for thumbnail, so it's not regenerated on each re-render (prevents flicker)
    let dataURI: string | undefined;
    if (thumbnail) {
      dataURI = thumbnail.src;
    }

    // Make sure that we always display progress bar when the file is uploading (prevents flicker)
    let { progress } = this.state;
    if (!progress && status === 'uploading') {
      progress = 0.0;
    }

    const isImageFile = isImage(fileMimeType);

    // Construct file details object
    const fileDetails = {
      name: fileName,
      size: fileSize,
      mimeType: fileMimeType,
      mediaType: thumbnail || isImageFile ? 'image' : 'unknown',
    } as FileDetails;

    const otherProps: any = {};
    if (onDelete) {
      otherProps.actions = [CardDelete(onDelete)];
    }

    return (
      <CardView
        // CardViewProps
        status={mapMediaStatusIntoCardStatus(this.state)}
        mediaItemType="file"
        metadata={fileDetails}
        // FileCardProps
        dataURI={dataURI}
        progress={progress}
        // SharedCardProps
        dimensions={cardDimensions}
        appearance={appearance}
        selectable={true}
        selected={selected}
        {...otherProps}
      />
    );
  }

  private handleMediaStateChange = (mediaState: MediaState) => {
    if (this.destroyed) {
      return;
    }

    this.setState({ ...mediaState });
  };

  private handleMediaProvider = async (mediaProvider: MediaProvider) => {
    const { id } = this.props;

    if (this.destroyed) {
      return;
    }

    /**
     * Try to get stateManager from MediaProvider first, if not, get the fallback from props
     */
    const stateManager =
      mediaProvider.stateManager || this.props.stateManagerFallback;

    this.setState({ mediaProvider });

    if (stateManager) {
      const mediaState = stateManager.getState(id);

      stateManager.on(id, this.handleMediaStateChange);
      this.setState({ id, ...mediaState });
    }

    await this.setContext('viewContext', mediaProvider);
    await this.setContext('linkCreateContext', mediaProvider);
  };

  private setContext = async (
    contextName: string,
    mediaProvider: MediaProvider,
  ) => {
    let context = await mediaProvider[contextName];

    if (this.destroyed || !context) {
      return;
    }

    if ('serviceHost' in (context as ContextConfig)) {
      context = ContextFactory.create(context as ContextConfig);
    }

    this.setState({ [contextName as any]: context as Context });
  };

  private get resizeMode(): ImageResizeMode {
    const { resizeMode } = this.props;

    return resizeMode || 'full-fit';
  }
}
