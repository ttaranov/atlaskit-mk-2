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
  dimensions: CardDimensions;
  onError?: (error: Error) => void;
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

  static defaultProps = {
    dimensions: defaultImageCardDimensions,
  };

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
              return;
            }
          }

          if (state.status === 'processed') {
            const { artifacts } = state;

            try {
              const fileSrc = await context.file.getArtifactURL(
                artifacts,
                'video_1280.mp4',
                collectionName,
              );

              this.setState({ fileSrc });
              setImmediate(this.unsubscribe);
            } catch (error) {
              const { onError } = this.props;

              if (onError) {
                onError(error);
              }
            }
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

  get style(): CSSProperties {
    const { width, height } = this.props.dimensions;
    return {
      width,
      height,
    };
  }

  render() {
    const { fileSrc } = this.state;

    if (!fileSrc) {
      const { dimensions } = this.props;
      return <CardLoading mediaItemType="file" dimensions={dimensions} />;
    }

    return (
      <InlinePlayerWrapper style={this.style}>
        <video src={fileSrc} autoPlay controls />
      </InlinePlayerWrapper>
    );
  }
}
