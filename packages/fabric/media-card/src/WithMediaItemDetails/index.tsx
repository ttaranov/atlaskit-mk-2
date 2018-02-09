import * as React from 'react';
import { Observable, Subscription } from 'rxjs';
import {
  Context,
  MediaItem,
  FileItem,
  FileDetails,
  LinkDetails,
  UrlPreview,
  MediaItemType,
} from '@atlaskit/media-core';
import { CardStatus } from '..';

export type Status = CardStatus;
export type Details = FileDetails | LinkDetails; // | UrlPreview;

export interface FunctionProps {
  status: Status;
  error?: Error;
  details?: Details;
}

export type RenderFunction = (props: FunctionProps) => React.ReactElement<any>;
export type CallbackFunction = (props: FunctionProps) => void;

export interface WithMediaItemDetailsProps {
  context: Context;
  type: MediaItemType;
  id: string;
  collection?: string;
  initialDetails?: Details;
  children: RenderFunction;
  onStatusChange?: CallbackFunction;
}

export interface WithMediaItemDetailsState {
  status: Status;
  error?: Error;
  details?: Details;
}

function loading(): WithMediaItemDetailsState {
  return {
    status: 'loading',
    error: undefined,
    details: undefined,
  };
}

function processing(details?: Details): WithMediaItemDetailsState {
  return {
    status: 'processing',
    details,
  };
}

function completed(details?: Details): WithMediaItemDetailsState {
  return {
    status: 'complete',
    details,
  };
}

function errored(error: Error): WithMediaItemDetailsState {
  return {
    status: 'error',
    error,
  };
}

export default class WithMediaItemDetails extends React.Component<
  WithMediaItemDetailsProps,
  WithMediaItemDetailsState
> {
  private subscription?: Subscription;

  constructor(props: WithMediaItemDetailsProps, ...args) {
    super(props, ...args);

    // initialise the state from the initial details
    const { type, initialDetails } = props;
    if (initialDetails) {
      if (type === 'file' && this.isFileItem(initialDetails)) {
        if (
          initialDetails.processingStatus === 'succeeded' ||
          initialDetails.processingStatus === 'failed'
        ) {
          this.state = completed(initialDetails);
        } else {
          this.state = processing(initialDetails);
        }
      } else {
        this.state = completed(initialDetails);
      }
    } else {
      this.state = loading();
    }
  }

  private isFileItem(details: Details): details is FileDetails {
    return !(details as LinkDetails).url;
  }

  private isMediaItem(
    mediaItem: MediaItem | UrlPreview,
  ): mediaItem is FileItem {
    return mediaItem && (mediaItem as MediaItem).details !== undefined;
  }

  callStatusChangeCallback(): void {
    const { onStatusChange } = this.props;
    const { status, error, details } = this.state;
    if (onStatusChange) {
      onStatusChange({
        status,
        error,
        details,
      });
    }
  }

  private needsUpdating(
    prevProps: WithMediaItemDetailsProps,
    nextProps: WithMediaItemDetailsProps,
  ): boolean {
    const {
      context: prevContext,
      type: prevType,
      id: prevId,
      collection: prevCollection,
    } = prevProps;
    const {
      context: nextContext,
      type: nextType,
      id: nextId,
      collection: nextCollection,
    } = nextProps;
    return (
      nextContext !== prevContext ||
      nextType !== prevType ||
      nextId !== prevId ||
      nextCollection !== prevCollection
    );
  }

  private observable(): Observable<FileDetails | LinkDetails> {
    const { context, type, id, collection } = this.props;
    const provider = context.getMediaItemProvider(id, type, collection);
    return provider.observable().map((result: MediaItem) => {
      return result.details;
    });
  }

  private subscribe(): void {
    this.unsubscribe();

    // left this here for backwards compatibility, but since the state is already loading from the start, maybe we shouldn't do it in componentDidMount
    this.callStatusChangeCallback();

    // expect we're loading, otherwise
    const { status } = this.state;
    if (status !== 'loading') {
      return;
    }

    this.subscription = this.observable().subscribe({
      next: details => {
        this.setState(processing(details), () =>
          this.callStatusChangeCallback(),
        );
      },

      complete: () => {
        this.setState(completed(), () => this.callStatusChangeCallback());
      },

      error: error => {
        this.setState(errored(error), () => this.callStatusChangeCallback());
      },
    });
  }

  private unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  retry(): void {
    this.setState(loading());
    this.subscribe();
  }

  componentDidMount(): void {
    this.subscribe();
  }

  componentWillReceiveProps(nextProps: WithMediaItemDetailsProps): void {
    if (this.needsUpdating(this.props, nextProps)) {
      this.setState(loading());
    }
  }

  componentDidUpdate(prevProps: WithMediaItemDetailsProps): void {
    if (this.needsUpdating(prevProps, this.props)) {
      this.subscribe();
    }
  }

  componentWillUnmount(): void {
    this.unsubscribe();
  }

  render() {
    const { children } = this.props;
    const { status, error, details } = this.state;
    return children({ status, error, details });
  }
}
