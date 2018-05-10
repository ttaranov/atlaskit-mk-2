import * as React from 'react';
import { Video } from '../styled';
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

export class VideoViewer extends React.Component<Props, State> {
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
        return <Video controls src={src.data} />;
      case 'FAILED':
        return <ErrorMessage>{src.err.message}</ErrorMessage>;
    }
  }

  private async init() {
    const { context, item, collectionName } = this.props;
    const videoUrl = getVideoArtifactUrl(item);
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

function getVideoArtifactUrl(fileItem: FileItem) {
  const artifact = 'video_640.mp4';
  return (
    fileItem.details &&
    fileItem.details.artifacts &&
    fileItem.details.artifacts[artifact] &&
    fileItem.details.artifacts[artifact].url
  );
}
