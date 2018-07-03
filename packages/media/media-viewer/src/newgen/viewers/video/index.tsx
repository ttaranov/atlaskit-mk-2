import * as React from 'react';
import { FileItem, Context } from '@atlaskit/media-core';
import { constructAuthTokenUrl } from '../../util';
import { Outcome, MediaViewerFeatureFlags } from '../../domain';
import { Spinner } from '../../loading';
import { ErrorMessage, Video } from '../../styled';
import { CustomVideo } from './customVideo';
import { getFeatureFlag } from '../../utils/getFeatureFlag';
import { isIE } from '../../utils/isIE';

export type Props = Readonly<{
  item: FileItem;
  context: Context;
  collectionName?: string;
  featureFlags?: MediaViewerFeatureFlags;
  showControls?: () => void;
  previewCount: number;
}>;

export type State = {
  src: Outcome<string, Error>;
  isHDActive: boolean;
};

const sdArtifact = 'video_640.mp4';
const hdArtifact = 'video_1280.mp4';
export class VideoViewer extends React.Component<Props, State> {
  state: State = { src: { status: 'PENDING' }, isHDActive: false };

  componentDidMount() {
    this.init();
  }

  private onHDChange = () => {
    const isHDActive = !this.state.isHDActive;
    this.setState({ isHDActive });
    this.init(isHDActive);
  };

  render() {
    const { src, isHDActive } = this.state;
    const { item, featureFlags, showControls, previewCount } = this.props;
    const useCustomVideoPlayer =
      !isIE() && getFeatureFlag('customVideoPlayer', featureFlags);
    const isAutoPlay = previewCount === 0;
    switch (src.status) {
      case 'PENDING':
        return <Spinner />;
      case 'SUCCESSFUL':
        if (useCustomVideoPlayer) {
          return (
            <CustomVideo
              isAutoPlay={isAutoPlay}
              onHDToggleClick={this.onHDChange}
              showControls={showControls}
              src={src.data}
              isHDActive={isHDActive}
              isHDAvailable={isHDAvailable(item)}
            />
          );
        } else {
          return <Video autoPlay={isAutoPlay} controls src={src.data} />;
        }
      case 'FAILED':
        return <ErrorMessage>{src.err.message}</ErrorMessage>;
    }
  }

  private async init(isHDActive?: boolean) {
    const { context, item, collectionName } = this.props;
    const preferHd = isHDActive && isHDAvailable(item);
    const videoUrl = getVideoArtifactUrl(item, preferHd);

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

function isHDAvailable(fileItem: FileItem): boolean {
  return (
    fileItem.details &&
    fileItem.details.artifacts &&
    fileItem.details.artifacts[hdArtifact] &&
    fileItem.details.artifacts[hdArtifact].url
  );
}

function getVideoArtifactUrl(fileItem: FileItem, preferHd?: boolean) {
  const artifact = preferHd ? hdArtifact : sdArtifact;

  return (
    fileItem.details &&
    fileItem.details.artifacts &&
    fileItem.details.artifacts[artifact] &&
    fileItem.details.artifacts[artifact].url
  );
}
