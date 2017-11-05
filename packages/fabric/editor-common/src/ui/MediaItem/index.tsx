import * as React from 'react';
import { PureComponent } from 'react';
import MediaComponent, { Appearance } from './MediaComponent';
import { CardEventClickHandler } from '../EventHandlers';
import { MediaType } from '../..';
import { CardDimensions } from '@atlaskit/media-card';
import {
  CardEventHandler,
  MediaStateManager,
  ImageResizeMode
} from '@atlaskit/media-core';
import {
  default as ProviderFactory,
  WithProviders
} from '../../providerFactory';

export interface Props {
  id: string;
  providers?: ProviderFactory;
  type: MediaType;
  collection: string;
  cardDimensions?: CardDimensions;
  resizeMode?: ImageResizeMode;
  onClick?: CardEventClickHandler;
  onDelete?: CardEventHandler;
  appearance?: Appearance;
  stateManagerFallback?: MediaStateManager;
}

export default class MediaItem extends PureComponent<Props, {}> {
  private providerFactory: ProviderFactory;

  constructor(props) {
    super(props);
    this.providerFactory = props.providers || new ProviderFactory();
  }

  componentWillUnmount() {
    if (!this.props.providers) {
      // new ProviderFactory is created if no `providers` has been set
      // in this case when component is unmounted it's safe to destroy this providerFactory
      this.providerFactory.destroy();
    }
  }

  private renderWithProvider = (providers) => {
    const {
      id,
      type,
      collection,
      cardDimensions,
      onClick,
      onDelete,
      resizeMode,
      appearance,
      stateManagerFallback
    } = this.props;

    return (
      <MediaComponent
        id={id}
        mediaProvider={providers.mediaProvider}
        type={type}
        collection={collection}
        cardDimensions={cardDimensions}
        resizeMode={resizeMode}
        onDelete={onDelete}
        onClick={onClick}
        appearance={appearance}
        stateManagerFallback={stateManagerFallback}
      />
    );
  }

  render() {
    return (
      <WithProviders
        providers={['mediaProvider']}
        providerFactory={this.providerFactory}
        renderNode={this.renderWithProvider}
      />
    );
  }
}
