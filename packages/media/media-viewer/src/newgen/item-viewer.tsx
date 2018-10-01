import * as React from 'react';
import { Context, FileState, ProcessedFileState } from '@atlaskit/media-core';
import { Outcome, Identifier, MediaViewerFeatureFlags } from './domain';
import { ImageViewer } from './viewers/image';
import { VideoViewer } from './viewers/video';
import { AudioViewer } from './viewers/audio';
import { DocViewer } from './viewers/doc';
import { Spinner } from './loading';
import { Subscription } from 'rxjs/Subscription';
import * as deepEqual from 'deep-equal';
import {
  ErrorMessage,
  createError,
  MediaViewerError,
  ErrorName,
} from './error';
import { renderDownloadButton } from './domain/download';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import {
  WithAnalyticsEventProps,
  AnalyticsEventPayload,
} from '@atlaskit/analytics-next-types';
import { channel, onViewerLoadPayload, onItemLoadedPayload } from './analytics';

export type Props = Readonly<{
  identifier: Identifier;
  context: Context;
  featureFlags?: MediaViewerFeatureFlags;
  showControls?: () => void;
  onClose?: () => void;
  previewCount: number;
}>;

export type State = {
  item: Outcome<FileState, MediaViewerError>;
  loadStarted: number;
};

const initialState: State = {
  item: Outcome.pending(),
  loadStarted: Date.now(),
};
class ItemViewerBase extends React.Component<
  Props & WithAnalyticsEventProps,
  State
> {
  state: State = initialState;

  private subscription?: Subscription;

  componentWillUpdate(nextProps: Props) {
    if (this.needsReset(this.props, nextProps)) {
      this.release();
      this.init(nextProps);
    }
  }

  componentWillUnmount() {
    this.release();
  }

  componentDidMount() {
    this.init(this.props);
  }

  private onViewerLoaded = (viewerPayload: onViewerLoadPayload) => {
    const { loadStarted } = this.state;
    const { id } = this.props.identifier;
    const endTime = Date.now();
    const loadDurationMsec = endTime - loadStarted;
    const viewerDurationMsec = viewerPayload.duration;
    const metadataDurationMsec = loadDurationMsec - viewerDurationMsec;
    const ev: onItemLoadedPayload = {
      action: 'viewed',
      fileId: id,
      status: 'success',
      viewerDurationMsec,
      loadDurationMsec,
      metadataDurationMsec,
    };
    this.fireAnalytics(ev);
  };

  private renderProcessedFile(item: ProcessedFileState) {
    const {
      context,
      identifier,
      featureFlags,
      showControls,
      onClose,
      previewCount,
    } = this.props;

    const viewerProps = {
      context,
      item,
      collectionName: identifier.collectionName,
      onClose,
      previewCount,
    };
    switch (item.mediaType) {
      case 'image':
        return <ImageViewer onLoaded={this.onViewerLoaded} {...viewerProps} />;
      case 'audio':
        return <AudioViewer onLoaded={this.onViewerLoaded} {...viewerProps} />;
      case 'video':
        return (
          <VideoViewer
            onLoaded={this.onViewerLoaded}
            showControls={showControls}
            featureFlags={featureFlags}
            {...viewerProps}
          />
        );
      case 'doc':
        return <DocViewer onLoaded={this.onViewerLoaded} {...viewerProps} />;
      default:
        return this.renderError('unsupported', item);
    }
  }

  private renderError(errorName: ErrorName, file?: FileState) {
    if (file) {
      return (
        <ErrorMessage error={createError(errorName, undefined, file)}>
          <p>Try downloading the file to view it.</p>
          {this.renderDownloadButton(file)}
        </ErrorMessage>
      );
    } else {
      return <ErrorMessage error={createError(errorName)} />;
    }
  }

  render() {
    return this.state.item.match({
      successful: item => {
        switch (item.status) {
          case 'processed':
            return this.renderProcessedFile(item);
          case 'error':
            return this.renderError('previewFailed', item);
          default:
            return <Spinner />;
        }
      },
      pending: () => <Spinner />,
      failed: err => this.renderError(err.errorName, this.state.item.data),
    });
  }

  private renderDownloadButton(file: FileState) {
    const { context, identifier } = this.props;
    return renderDownloadButton(file, context, identifier.collectionName);
  }

  private init(props: Props) {
    const startTime = Date.now();
    const state = {
      ...initialState,
      loadStarted: startTime,
    };
    this.setState(state, () => {
      // Loading the file after rendering the inital state prevent the following bugs:
      // MS-803
      // MS-823
      // MS-822
      // Once these issues have been fixed, we can make this sequence synchronous
      const { context, identifier } = props;
      this.subscription = context
        .getFile(identifier.id, { collectionName: identifier.collectionName })
        .subscribe({
          next: file => {
            this.setState({
              item: Outcome.successful(file),
            });
          },
          error: err => {
            this.setState({
              item: Outcome.failed(createError('metadataFailed', err)),
            });
            this.fireAnalyticsError('Metadata fetching failed');
          },
        });
    });
  }

  private fireAnalyticsError = (failReason: string) => {
    const errorPayload: onItemLoadedPayload = {
      action: 'viewed',
      status: 'fail',
      fileId: this.props.identifier.id,
      failReason,
    };
    this.fireAnalytics(errorPayload);
  };

  private fireAnalytics = (payload: AnalyticsEventPayload) => {
    if (this.props.createAnalyticsEvent) {
      const ev = this.props.createAnalyticsEvent(payload);
      ev.fire(channel);
    }
  };

  // It's possible that a different identifier or context was passed.
  // We therefore need to reset Media Viewer.
  private needsReset(propsA: Props, propsB: Props) {
    return (
      !deepEqual(propsA.identifier, propsB.identifier) ||
      propsA.context !== propsB.context
    );
  }

  release() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

export default withAnalyticsEvents()(ItemViewerBase);
