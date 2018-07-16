import * as React from 'react';
import { FileItem, Context } from '@atlaskit/media-core';
import { constructAuthTokenUrl } from '../../util';
import { Outcome, MediaViewerFeatureFlags } from '../../domain';
import { Spinner } from '../../loading';
import { Video } from '../../styled';
import { CustomVideo } from './customVideo';
import { getFeatureFlag } from '../../utils/getFeatureFlag';
import { isIE } from '../../utils/isIE';
import { ErrorMessage, createError, MediaViewerError } from '../../error';
import { renderDownloadButton } from '../../domain/download';

export type Props = Readonly<{
  item: FileItem;
  context: Context;
  collectionName?: string;
  featureFlags?: MediaViewerFeatureFlags;
  showControls?: () => void;
  previewCount: number;
}>;

export type State = {
  src: Outcome<string, MediaViewerError>;
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
        return (
          <ErrorMessage error={src.err}>
            <p>Try downloading the file to view it.</p>
            {this.renderDownloadButton()}
          </ErrorMessage>
        );
    }
  }

  private async init(isHDActive?: boolean) {
    const { context, item, collectionName } = this.props;
    const preferHd = isHDActive && isHDAvailable(item);
    const videoUrl = getVideoArtifactUrl(item, preferHd);
    if (!videoUrl) {
      return;
    }
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
          err: createError('previewFailed', item, err),
        },
      });
    }
  }

  private renderDownloadButton() {
    const { item, context, collectionName } = this.props;
    return renderDownloadButton(item, context, collectionName);
  }
}

function isHDAvailable(fileItem: FileItem): boolean {
  return !!(
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
