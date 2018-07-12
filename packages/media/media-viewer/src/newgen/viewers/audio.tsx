import * as React from 'react';
import { FileItem, Context } from '@atlaskit/media-core';
import AudioIcon from '@atlaskit/icon/glyph/media-services/audio';
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
): Promise<string> => {
  const dataUriService = context.getDataUriService(collectionName);
  return dataUriService.fetchImageDataUri(item, { width: 400, height: 210 });
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
        return this.renderPlayer(src.data);
      case 'FAILED':
        return (
          <ErrorMessage error={src.err}>
            <p>Try downloading the file to view it.</p>
            {this.renderDownloadButton()}
          </ErrorMessage>
        );
    }
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
        cover
        {this.renderCover()}
        end cover
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
    try {
      const audioUrl = await context.getArtifactUrl(
        item.details.id,
        'audio.mp3',
        collectionName,
      );
      this.setCoverUrl();
      this.setState({
        src: {
          status: 'SUCCESSFUL',
          data: audioUrl,
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
