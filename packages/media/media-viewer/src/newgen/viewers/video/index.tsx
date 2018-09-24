import * as React from 'react';
import { Context, ProcessedFileState } from '@atlaskit/media-core';
import { constructAuthTokenUrl } from '../../utils';
import { Outcome, MediaViewerFeatureFlags } from '../../domain';
import { Spinner } from '../../loading';
import { Video } from '../../styled';
import { CustomVideo } from './customVideo';
import { getFeatureFlag } from '../../utils/getFeatureFlag';
import { isIE } from '../../utils/isIE';
import { ErrorMessage, createError, MediaViewerError } from '../../error';
import { renderDownloadButton } from '../../domain/download';
import { getArtifactUrl } from '@atlaskit/media-store';

export type Props = Readonly<{
  item: ProcessedFileState;
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
  state: State = { src: Outcome.pending(), isHDActive: false };

  componentDidMount() {
    this.init();
  }

  private onHDChange = () => {
    const isHDActive = !this.state.isHDActive;
    this.setState({ isHDActive });
    this.init(isHDActive);
  };

  render() {
    const { isHDActive } = this.state;
    const { item, featureFlags, showControls, previewCount } = this.props;
    const useCustomVideoPlayer =
      !isIE() && getFeatureFlag('customVideoPlayer', featureFlags);
    const isAutoPlay = previewCount === 0;
    return this.state.src.match({
      pending: () => <Spinner />,
      successful: src =>
        useCustomVideoPlayer ? (
          <CustomVideo
            isAutoPlay={isAutoPlay}
            onHDToggleClick={this.onHDChange}
            showControls={showControls}
            src={src}
            isHDActive={isHDActive}
            isHDAvailable={isHDAvailable(item)}
          />
        ) : (
          <Video autoPlay={isAutoPlay} controls src={src} />
        ),
      failed: err => (
        <ErrorMessage error={err}>
          <p>Try downloading the file to view it.</p>
          {this.renderDownloadButton()}
        </ErrorMessage>
      ),
    });
  }

  private async init(isHDActive?: boolean) {
    const { context, item, collectionName } = this.props;
    const preferHd = isHDActive && isHDAvailable(item);
    const videoUrl = getVideoArtifactUrl(item, preferHd);
    try {
      if (!videoUrl) {
        throw new Error('No video artifacts found');
      }
      this.setState({
        src: Outcome.successful(
          await constructAuthTokenUrl(videoUrl, context, collectionName),
        ),
      });
    } catch (err) {
      this.setState({
        /// TODO: error properties
        src: Outcome.failed(createError('previewFailed')),
      });
    }
  }

  private renderDownloadButton() {
    const { item, context, collectionName } = this.props;
    return renderDownloadButton(item, context, collectionName);
  }
}

function isHDAvailable(file: ProcessedFileState): boolean {
  return !!getArtifactUrl(file.artifacts, hdArtifact);
}

function getVideoArtifactUrl(
  file: ProcessedFileState,
  preferHd?: boolean,
): string | undefined {
  const artifactName = preferHd ? hdArtifact : sdArtifact;
  return getArtifactUrl(file.artifacts, artifactName);
}
