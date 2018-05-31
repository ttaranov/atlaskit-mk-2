import * as React from 'react';
import { FileItem, Context } from '@atlaskit/media-core';
import { constructAuthTokenUrl } from '../../util';
import { Outcome, MediaViewerFeatureFlags } from '../../domain';
import { Spinner } from '../../loading';
import { ErrorMessage, Video } from '../../styled';
import { CustomVideo } from './customVideo';
import { getFeatureFlag } from '../../utils/getFeatureFlag';

export type Props = {
  item: FileItem;
  context: Context;
  collectionName?: string;
  readonly featureFlags?: MediaViewerFeatureFlags;
  readonly showControls?: () => void;
};

export type State = {
  src: Outcome<string, Error>;
  isHDActive: boolean;
};

const isIE =
  navigator.userAgent.indexOf('MSIE') !== -1 ||
  navigator.appVersion.indexOf('Trident/') > 0;

export class VideoViewer extends React.Component<Props, State> {
  state: State = { src: { status: 'PENDING' }, isHDActive: false };

  componentDidMount() {
    this.init();
  }

  private onHDChange = (isHDActive: boolean) => {
    this.setState({ isHDActive });
    this.init(isHDActive);
  };

  render() {
    const { src, isHDActive } = this.state;
    const { featureFlags, showControls } = this.props;
    const useCustomVideoPlayer =
      !isIE && getFeatureFlag('customVideoPlayer', featureFlags);

    switch (src.status) {
      case 'PENDING':
        return <Spinner />;
      case 'SUCCESSFUL':
        if (useCustomVideoPlayer) {
          return (
            <CustomVideo
              onHDChange={this.onHDChange}
              showControls={showControls}
              src={src.data}
              isHDActive={isHDActive}
            />
          );
        } else {
          return <Video controls src={src.data} />;
        }
      case 'FAILED':
        return <ErrorMessage>{src.err.message}</ErrorMessage>;
    }
  }

  private async init(isHDActive?: boolean) {
    const { context, item, collectionName } = this.props;
    const videoUrl = getVideoArtifactUrl(item, isHDActive);

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

function getVideoArtifactUrl(fileItem: FileItem, hdMode?: boolean) {
  const smallVideoArtifact = 'video_640.mp4';
  const largeVideoArtifact = 'video_1280.mp4';
  const hdVideoArtifact = 'video_hd.mp4';
  const artifact = hdMode
    ? hdVideoArtifact
    : window.innerWidth <= 640 ? smallVideoArtifact : largeVideoArtifact;

  return (
    fileItem.details &&
    fileItem.details.artifacts &&
    fileItem.details.artifacts[artifact] &&
    fileItem.details.artifacts[artifact].url
  );
}
