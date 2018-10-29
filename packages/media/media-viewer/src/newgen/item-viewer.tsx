import * as React from 'react';
import { Context, FileState, ProcessedFileState } from '@atlaskit/media-core';
import { FormattedMessage } from 'react-intl';
import { messages } from '@atlaskit/media-ui';
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
import { ErrorViewDownloadButton } from './download';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { WithAnalyticsEventProps } from '@atlaskit/analytics-next-types';
import {
  ViewerLoadPayload,
  itemViewerErrorEvent,
  itemViewerCommencedEvent,
  itemViewerLoadedEvent,
  mediaViewerModalScreenEvent,
} from './analytics/item-viewer';
import { channel } from './analytics/index';
import {
  GasPayload,
  GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';

export type Props = Readonly<{
  identifier: Identifier;
  context: Context;
  featureFlags?: MediaViewerFeatureFlags;
  showControls?: () => void;
  onClose?: () => void;
  previewCount: number;
}> &
  WithAnalyticsEventProps;

export type State = {
  item: Outcome<FileState, MediaViewerError>;
};

const initialState: State = {
  item: Outcome.pending(),
};
export class ItemViewerBase extends React.Component<Props, State> {
  state: State = initialState;

  private subscription?: Subscription;

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.needsReset(this.props, nextProps)) {
      this.release();
      this.setState(initialState);
    }
  }

  componentDidUpdate(oldProps: Props) {
    if (this.needsReset(oldProps, this.props)) {
      this.init(this.props);
    }
  }

  componentWillUnmount() {
    this.release();
  }

  componentDidMount() {
    this.init(this.props);
  }

  private onViewerLoaded = (payload: ViewerLoadPayload) => {
    const { id } = this.props.identifier;
    const { item } = this.state;
    // the item.whenFailed case is handled in the "init" method
    item.whenSuccessful(file => {
      if (file.status === 'processed') {
        if (payload.status === 'success') {
          this.fireAnalytics(itemViewerLoadedEvent(file));
        } else if (payload.status === 'error') {
          this.fireAnalytics(
            itemViewerErrorEvent(
              id,
              payload.errorMessage || 'Viewer error',
              file,
            ),
          );
        }
      }
    });
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
        return <ImageViewer onLoad={this.onViewerLoaded} {...viewerProps} />;
      case 'audio':
        return <AudioViewer {...viewerProps} />;
      case 'video':
        return (
          <VideoViewer
            showControls={showControls}
            featureFlags={featureFlags}
            {...viewerProps}
          />
        );
      case 'doc':
        return <DocViewer {...viewerProps} />;
      default:
        return this.renderError('unsupported', item);
    }
  }

  private renderError(errorName: ErrorName, file?: FileState) {
    if (file) {
      const err = createError(errorName, undefined, file);
      return (
        <ErrorMessage error={err}>
          <p>
            <FormattedMessage {...messages.try_downloading_file} />
          </p>
          {this.renderDownloadButton(file, err)}
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
          case 'failed-processing':
          case 'error':
            return this.renderError('previewFailed', item);
          case 'uploading':
          case 'processing':
            return <Spinner />;
        }
      },
      pending: () => <Spinner />,
      failed: err => this.renderError(err.errorName, this.state.item.data),
    });
  }

  private renderDownloadButton(state: FileState, err: MediaViewerError) {
    const { context, identifier } = this.props;
    return (
      <ErrorViewDownloadButton
        state={state}
        context={context}
        err={err}
        collectionName={identifier.collectionName}
      />
    );
  }

  private init(props: Props) {
    const { context, identifier } = props;
    this.fireAnalytics(itemViewerCommencedEvent(identifier.id));
    this.fireAnalytics(mediaViewerModalScreenEvent(identifier.id));
    this.subscription = context.file
      .getFileState(identifier.id, {
        collectionName: identifier.collectionName,
      })
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
          this.fireAnalytics(
            itemViewerErrorEvent(identifier.id, 'Metadata fetching failed'),
          );
        },
      });
  }

  private fireAnalytics = (payload: GasPayload | GasScreenEventPayload) => {
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

  private release() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

export const ItemViewer = withAnalyticsEvents()(ItemViewerBase);
