import * as React from 'react';
import { Context, ProcessedFileState } from '@atlaskit/media-core';
import { constructAuthTokenUrl } from '../../utils';
import { Outcome, MediaViewerFeatureFlags } from '../../domain';
import { Video } from '../../styled';
import { CustomVideo } from './customVideo';
import { getFeatureFlag } from '../../utils/getFeatureFlag';
import { isIE } from '../../utils/isIE';
import { createError, MediaViewerError } from '../../error';
import { getArtifactUrl } from '@atlaskit/media-store';
import { BaseState, BaseViewer } from '../base-viewer';

export type Props = Readonly<{
  item: ProcessedFileState;
  context: Context;
  collectionName?: string;
  featureFlags?: MediaViewerFeatureFlags;
  showControls?: () => void;
  previewCount: number;
}>;

export type State = BaseState<string> & {
  isHDActive: boolean;
};

const sdArtifact = 'video_640.mp4';
const hdArtifact = 'video_1280.mp4';
export class VideoViewer extends BaseViewer<string, Props, State> {
  protected get initialState() {
    return {
      content: Outcome.pending<string, MediaViewerError>(),
      isHDActive: false,
    };
  }

  private onHDChange = () => {
    const isHDActive = !this.state.isHDActive;
    this.setState({ isHDActive });
    this.init(isHDActive);
  };

  protected renderSuccessful(content: string) {
    const { isHDActive } = this.state;
    const { item, featureFlags, showControls, previewCount } = this.props;
    const useCustomVideoPlayer =
      !isIE() && getFeatureFlag('customVideoPlayer', featureFlags);
    const isAutoPlay = previewCount === 0;
    return useCustomVideoPlayer ? (
      <CustomVideo
        isAutoPlay={isAutoPlay}
        onHDToggleClick={this.onHDChange}
        showControls={showControls}
        src={content}
        isHDActive={isHDActive}
        isHDAvailable={isHDAvailable(item)}
      />
    ) : (
      <Video autoPlay={isAutoPlay} controls src={content} />
    );
  }

  protected async init(isHDActive?: boolean) {
    const { context, item, collectionName } = this.props;
    const preferHd = isHDActive && isHDAvailable(item);
    const videoUrl = getVideoArtifactUrl(item, preferHd);
    try {
      if (!videoUrl) {
        throw new Error('No video artifacts found');
      }
      this.setState({
        content: Outcome.successful(
          await constructAuthTokenUrl(videoUrl, context, collectionName),
        ),
      });
    } catch (err) {
      this.setState({
        content: Outcome.failed(createError('previewFailed', err, item)),
      });
    }
  }

  protected release() {}
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
