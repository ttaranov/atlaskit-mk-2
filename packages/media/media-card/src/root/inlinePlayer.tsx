import * as React from 'react';
import { Component, CSSProperties } from 'react';
import { Context } from '@atlaskit/media-core';
import { FileIdentifier } from './domain';
import { InlinePlayerWrapper } from './styled';
import { CardDimensions, defaultImageCardDimensions } from '..';
import { Subscription } from 'rxjs/Subscription';
import { CardLoading } from '../utils/cardLoading';

export interface InlinePlayerProps {
  identifier: FileIdentifier;
  context: Context;
  dimensions?: CardDimensions;
}

export interface InlinePlayerState {
  fileSrc?: string;
}

export class InlinePlayer extends Component<
  InlinePlayerProps,
  InlinePlayerState
> {
  subscription?: Subscription;
  state: InlinePlayerState = {};

  async componentDidMount() {
    const { context, identifier } = this.props;
    const { id, collectionName } = identifier;

    this.revoke();
    this.unsubscribe();
    this.subscription = context.file
      .getFileState(await id, { collectionName })
      .subscribe({
        next: async state => {
          if (state.status !== 'error' && state.preview) {
            const { blob } = state.preview;

            if (blob.type.indexOf('video/') === 0) {
              const fileSrc = URL.createObjectURL(state.preview.blob);
              this.setState({ fileSrc });
              setImmediate(this.unsubscribe);
            }
          }

          if (state.status === 'processed') {
            const { artifacts } = state;
            const fileSrc = await context.file.getArtifactURL(
              artifacts,
              'video_1280.mp4',
              collectionName,
            );

            this.setState({ fileSrc });
            setImmediate(this.unsubscribe);
          }
        },
      });
  }

  unsubscribe = () => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  };

  revoke = () => {
    const { fileSrc } = this.state;
    if (fileSrc) {
      URL.revokeObjectURL(fileSrc);
    }
  };

  componentWillUnmount() {
    this.unsubscribe();
    this.revoke();
  }

  get dimensions(): CardDimensions {
    return this.props.dimensions || defaultImageCardDimensions;
  }

  get style(): CSSProperties {
    const { width, height } = this.dimensions;
    return {
      width,
      height,
    };
  }

  render() {
    const { fileSrc } = this.state;

    if (!fileSrc) {
      return <CardLoading mediaItemType="file" dimensions={this.dimensions} />;
    }

    return (
      <InlinePlayerWrapper style={this.style}>
        <video src={fileSrc} autoPlay controls />
      </InlinePlayerWrapper>
    );
  }
}
