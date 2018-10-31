import * as React from 'react';
import { Component } from 'react';
import { Context } from '@atlaskit/media-core';
import { FileIdentifier } from './domain';
import { InlinePlayerWrapper } from './styled';
import { CardDimensions } from '..';

export interface InlinePlayerProps {
  identifier: FileIdentifier;
  context: Context;
  dimensions?: CardDimensions;
}

export interface InlinePlayerState {
  fileSrc?: string;
}

// TODO: Use local preview.blob if file is not processed
// TODO: Loading state?
// TODO: dimensions
// TODO: close icon
// TODO: onClose callback

export class InlinePlayer extends Component<
  InlinePlayerProps,
  InlinePlayerState
> {
  state: InlinePlayerState = {};

  async componentDidMount() {
    const { context, identifier } = this.props;
    const { id, collectionName } = identifier;

    // TODO: unsubscribe
    context.file.getFileState(await id, { collectionName }).subscribe({
      next: async state => {
        if (state.status !== 'error' && state.preview) {
          const { blob } = state.preview;

          if (blob.type.indexOf('video/') === 0) {
            console.log(state.preview);
            console.log(state.preview.blob.type);
            const fileSrc = URL.createObjectURL(state.preview.blob);

            this.setState({
              fileSrc,
            });
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
        }
      },
    });
  }

  render() {
    const { fileSrc } = this.state;
    const { dimensions } = this.props;

    if (!fileSrc) {
      return <div>loading...</div>;
    }

    console.log(dimensions);

    return (
      <InlinePlayerWrapper
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
      >
        <video src={fileSrc} autoPlay controls />
      </InlinePlayerWrapper>
    );
  }
}
