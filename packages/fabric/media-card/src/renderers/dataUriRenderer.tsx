import * as React from 'react';
import { Component, ReactNode } from 'react';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Context, MediaItem } from '@atlaskit/media-core';

const INITIAL_STATE = {
  dataUri: undefined,
  isLoading: true,
};

export type DataUriRendererProps = {
  readonly context: Context;
  readonly collectionName: string;
  readonly mediaItem: MediaItem;

  readonly children: (state: DataUriRendererState) => ReactNode;
};

export type DataUriRendererState = {
  readonly dataUri?: string;
  readonly isLoading: boolean;
};

export class DataUriRenderer extends Component<
  DataUriRendererProps,
  DataUriRendererState
> {
  private subscription: Subscription;

  constructor(props: DataUriRendererProps) {
    super(props);
    this.state = INITIAL_STATE;
  }

  componentWillReceiveProps(
    nextProps: Readonly<DataUriRendererProps>,
    nextContext: any,
  ): void {
    const { context, collectionName, mediaItem } = this.props;
    if (
      nextProps.context !== context ||
      nextProps.collectionName !== collectionName ||
      nextProps.mediaItem !== mediaItem
    ) {
      this.loadDataUri(nextProps);
    }
  }

  componentDidMount() {
    this.loadDataUri(this.props);
  }

  componentWillUnmount(): void {
    this.unsubscribe();
  }

  shouldComponentUpdate(
    nextProps: Readonly<DataUriRendererProps>,
    nextState: Readonly<DataUriRendererState>,
    nextContext: any,
  ): boolean {
    const { isLoading, dataUri } = this.state;
    return nextState.isLoading !== isLoading || nextState.dataUri !== dataUri;
  }

  render() {
    const children = this.props.children(this.state);
    return <div>{children}</div>;
  }

  private loadDataUri({
    context,
    collectionName,
    mediaItem,
  }: DataUriRendererProps): void {
    this.unsubscribe();
    this.setState(INITIAL_STATE, () => {
      if (mediaItem.type === 'file') {
        this.subscription = Observable.fromPromise(
          context
            .getDataUriService(collectionName)
            .fetchImageDataUri(mediaItem, {
              width: 640,
              height: 480,
            }),
        ).subscribe({
          next: dataUri =>
            this.setState({
              dataUri,
              isLoading: false,
            }),
        });
      }
    });
  }

  private unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
