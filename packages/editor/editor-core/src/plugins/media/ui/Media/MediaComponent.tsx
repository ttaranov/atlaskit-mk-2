import * as React from 'react';
import { Component } from 'react';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import {
  Card,
  CardDimensions,
  CardEventHandler,
  CardAction,
} from '@atlaskit/media-card';
import { Context, ImageResizeMode } from '@atlaskit/media-core';
import {
  MediaType,
  MediaBaseAttributes,
  CardEventClickHandler,
  withImageLoader,
  ImageStatus,
  // @ts-ignore
  ImageLoaderProps,
  // @ts-ignore
  ImageLoaderState,
} from '@atlaskit/editor-common';

import {
  MediaProvider,
  MediaStateManager,
  MediaState,
} from '../../pm-plugins/main';

export type Appearance = 'small' | 'image' | 'horizontal' | 'square';

// This is being used by DropPlaceholder now
export const MEDIA_HEIGHT = 125;
export const FILE_WIDTH = 156;

export interface Props extends Partial<MediaBaseAttributes> {
  type: MediaType;
  mediaProvider?: Promise<MediaProvider>;
  cardDimensions?: CardDimensions;
  onClick?: CardEventClickHandler;
  onDelete?: CardEventHandler;
  resizeMode?: ImageResizeMode;
  appearance?: Appearance;
  stateManagerFallback?: MediaStateManager;
  selected?: boolean;
  url?: string;
  imageStatus?: ImageStatus;
  disableOverlay?: boolean;
}

export interface State extends MediaState {
  mediaProvider?: MediaProvider;
  viewContext?: Context;
  linkCreateContext?: Context;
}

export class MediaComponentInternal extends Component<Props, State> {
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

  componentWillReceiveProps(nextProps: Props) {
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
  }

  render() {
    const { viewContext, linkCreateContext } = this.state;
    const {
      cardDimensions,
      collection,
      id,
      onDelete,
      onClick,
      selected,
      disableOverlay,
      url,
      type,
    } = this.props;
    const otherProps: any = {};

    if (onDelete) {
      otherProps.actions = [createDeleteAction(onDelete)];
    }

    if (onClick) {
      otherProps.onClick = onClick;
    }

    const identifier =
      type === 'external'
        ? {
            dataURI: url,
            name: url,
            mediaItemType: 'external',
          }
        : {
            id,
            mediaItemType: type,
            collectionName: collection,
          };

    return (
      <Card
        context={type === 'link' ? linkCreateContext : viewContext!}
        dimensions={cardDimensions}
        identifier={identifier}
        selectable={true}
        selected={selected}
        resizeMode={this.resizeMode}
        disableOverlay={disableOverlay}
        {...otherProps}
      />
    );
  }

  private handleMediaProvider = async (mediaProvider: MediaProvider) => {
    if (this.destroyed) {
      return;
    }
    this.setState({ mediaProvider });
    await this.setContext('viewContext', mediaProvider);
    await this.setContext('linkCreateContext', mediaProvider);
  };

  private setContext = async (
    contextName: string,
    mediaProvider: MediaProvider,
  ) => {
    const context = await mediaProvider[contextName];

    if (this.destroyed || !context) {
      return;
    }

    // TODO: [ts30] WTF?
    this.setState({ [contextName as any]: context, id: this.state.id });
  };

  private get resizeMode(): ImageResizeMode {
    const { resizeMode } = this.props;

    return resizeMode || 'full-fit';
  }
}

export const createDeleteAction = (
  eventHander: CardEventHandler,
): CardAction => {
  return {
    label: 'Delete',
    handler: eventHander,
    icon: <CrossIcon size="small" label="delete" />,
  };
};

export default withImageLoader<Props>(MediaComponentInternal);
