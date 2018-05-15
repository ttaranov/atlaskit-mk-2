import * as React from 'react';
import { FileItem, Context } from '@atlaskit/media-core';
import { constructAuthTokenUrl } from '../util';
import { Outcome } from '../domain';
import { Spinner } from '../loading';
import { ErrorMessage } from '../styled';

export type Props = {
  item: FileItem;
  context: Context;
  collectionName?: string;
};

export type State = {
  src: Outcome<string, Error>;
};

export class AudioViewer extends React.Component<Props, State> {
  state: State = { src: { status: 'PENDING' } };

  componentDidMount() {
    this.init();
  }

  render() {
    const { src } = this.state;
    switch (src.status) {
      case 'PENDING':
        return <Spinner />;
      case 'SUCCESSFUL':
        return <audio controls src={src.data} preload="metadata" />;
      case 'FAILED':
        return <ErrorMessage>{src.err.message}</ErrorMessage>;
    }
  }

  private async init() {
    const { context, item, collectionName } = this.props;
    const videoUrl = getAudioArtifactUrl(item);
    try {
      this.setState({
        src: {
          status: 'SUCCESSFUL',
          data: await constructAuthTokenUrl(videoUrl, context, collectionName),
        },
      });
    } catch (err) {
      this.setState({
        src: {
          status: 'FAILED',
          err,
        },
      });
    }
  }
}

function getAudioArtifactUrl(fileItem: FileItem) {
  const artifact = 'audio.mp3';
  return (
    fileItem.details &&
    fileItem.details.artifacts &&
    fileItem.details.artifacts[artifact] &&
    fileItem.details.artifacts[artifact].url
  );
}
