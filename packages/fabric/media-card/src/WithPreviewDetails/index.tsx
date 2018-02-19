import * as React from 'react';
import { Observable, Subscription } from 'rxjs';
import { Context, UrlPreview } from '@atlaskit/media-core';
import { CardStatus } from '..';

export type Status = CardStatus;
export type Details = UrlPreview;

export interface FunctionProps {
  status: Status;
  error?: Error;
  details?: Details;
}

export type RenderFunction = (props: FunctionProps) => React.ReactElement<any>;
export type CallbackFunction = (props: FunctionProps) => void;

export interface WithPreviewDetailsProps {
  context: Context;
  url: string;
  initialDetails?: Details;
  children: RenderFunction;
  onStatusChange?: CallbackFunction;
}

export interface WithPreviewDetailsState {
  status: Status;
  error?: Error;
  details?: Details;
}

function loading(): WithPreviewDetailsState {
  return {
    status: 'loading',
    error: undefined,
    details: undefined,
  };
}

function completed(details?: Details): WithPreviewDetailsState {
  return {
    status: 'complete',
    details,
  };
}

function errored(error: Error): WithPreviewDetailsState {
  return {
    status: 'error',
    error,
  };
}

export default class WithPreviewDetails extends React.Component<
  WithPreviewDetailsProps,
  WithPreviewDetailsState
> {
  private subscription?: Subscription;

  constructor(props: WithPreviewDetailsProps, ...args) {
    super(props, ...args);

    // initialise the state from the initial details
    const { initialDetails } = props;
    if (initialDetails) {
      this.state = completed(initialDetails);
    } else {
      this.state = loading();
    }
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
    prevProps: WithPreviewDetailsProps,
    nextProps: WithPreviewDetailsProps,
  ): boolean {
    const { context: prevContext, type: prevType, url: prevUrl } = prevProps;
    const { context: nextContext, type: nextType, url: nextUrl } = nextProps;
    return (
      nextContext !== prevContext ||
      nextType !== prevType ||
      nextUrl !== prevUrl
    );
  }

  private observable(): Observable<UrlPreview> {
    const { context, url } = this.props;
    const provider = context.getUrlPreviewProvider(url);
    return provider.observable().map((result: UrlPreview) => {
      return result;
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
        this.setState(completed(details), () =>
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

  componentWillReceiveProps(nextProps: WithPreviewDetailsProps): void {
    if (this.needsUpdating(this.props, nextProps)) {
      this.setState(loading());
    }
  }

  componentDidUpdate(prevProps: WithPreviewDetailsProps): void {
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
