import * as React from 'react';
import { FileItem, Context } from '@atlaskit/media-core';
import AudioIcon from '@atlaskit/icon/glyph/media-services/audio';
import { constructAuthTokenUrl } from '../utils';
import { Outcome } from '../domain';
import { Spinner } from '../loading';
import {
  AudioPlayer,
  AudioCover,
  Audio,
  DefaultCoverWrapper,
  blanketColor,
} from '../styled';
import { ErrorMessage, createError, MediaViewerError } from '../error';
import { renderDownloadButton } from '../domain/download';

export type Props = Readonly<{
  item: FileItem;
  context: Context;
  collectionName?: string;
  previewCount: number;
}>;

export type State = {
  src: Outcome<string, MediaViewerError>;
  coverUrl?: string;
};

const defaultCover = (
  <DefaultCoverWrapper>
    <AudioIcon label="cover" size="xlarge" primaryColor={blanketColor} />
  </DefaultCoverWrapper>
);

const getCoverUrl = (
  item: FileItem,
  context: Context,
  collectionName?: string,
): Promise<string> =>
  constructAuthTokenUrl(
    `/file/${item.details.id}/image`,
    context,
    collectionName,
  );

export class AudioViewer extends React.Component<Props, State> {
  state: State = { src: Outcome.pending() };

  componentDidMount() {
    this.init();
  }

  render() {
    return this.state.src.match({
      pending: () => <Spinner />,
      successful: src => this.renderPlayer(src),
      failed: err => (
        <ErrorMessage error={err}>
          <p>Try downloading the file to view it.</p>
          {this.renderDownloadButton()}
        </ErrorMessage>
      ),
    });
  }

  private renderCover = () => {
    const { item } = this.props;
    const { coverUrl } = this.state;

    if (coverUrl) {
      return <AudioCover src={coverUrl} alt={item.details.name} />;
    } else {
      return defaultCover;
    }
  };

  private saveAudioElement = (audioElement?: HTMLElement) => {
    if (!audioElement) {
      return;
    }

    audioElement.setAttribute('controlsList', 'nodownload');
  };

  private renderPlayer = (src: string) => {
    const { previewCount } = this.props;
    return (
      <AudioPlayer>
        {this.renderCover()}
        <Audio
          autoPlay={previewCount === 0}
          controls
          innerRef={this.saveAudioElement}
          src={src}
          preload="metadata"
        />
      </AudioPlayer>
    );
  };

  private loadCover = (coverUrl: string) => {
    return new Promise(async (resolve, reject) => {
      const img = new Image();

      img.src = coverUrl;
      img.onload = resolve;
      img.onerror = reject;
    });
  };

  private setCoverUrl = async () => {
    const { context, item, collectionName } = this.props;
    const coverUrl = await getCoverUrl(item, context, collectionName);

    try {
      await this.loadCover(coverUrl);
      this.setState({ coverUrl });
    } catch (e) {}
  };

  private async init() {
    const { context, item, collectionName } = this.props;
    const audioUrl = getAudioArtifactUrl(item);
    try {
      if (!audioUrl) {
        throw new Error('No audio artifacts found');
      }
      this.setCoverUrl();
      this.setState({
        src: Outcome.successful(
          await constructAuthTokenUrl(audioUrl, context, collectionName),
        ),
      });
    } catch (err) {
      this.setState({
        src: Outcome.failed(createError('previewFailed', item, err)),
      });
    }
  }

  private renderDownloadButton() {
    const { item, context, collectionName } = this.props;
    return renderDownloadButton(item, context, collectionName);
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
