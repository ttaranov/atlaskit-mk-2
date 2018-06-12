import * as React from 'react';
import memoize from 'memoize-one';
import LazyRender from 'react-lazily-render';
import { auth } from '@atlassian/outbound-auth-flow-client';
import { ObjectState, AuthService, Client } from '../Client';
import { WithObject } from '../WithObject';
import { extractPropsFromJSONLD } from './extractPropsFromJSONLD';
import { CollapsedFrame } from './CollapsedFrame';
import { ResolvingView } from './ResolvingView';
import { ResolvedView } from './ResolvedView';
import { UnauthorisedView } from './UnauthorisedView';
import { ForbiddenView } from './ForbiddenView';
import { ErroredView } from './ErroredView';
import { minWidth, maxWidth } from './dimensions';

const memoizeExtractPropsFromJSONLD = memoize(extractPropsFromJSONLD);

interface CardContentProps {
  state: ObjectState;
  reload: () => void;
  onClick?: () => void;
}

class CardContent extends React.Component<CardContentProps> {
  extractViewProps() {
    const { state } = this.props;
    return memoizeExtractPropsFromJSONLD(state.data || {});
  }

  get collapsedIcon() {
    const props = this.extractViewProps();
    return (
      (props && props.icon && props.icon.url) ||
      (props && props.context && props.context.icon)
    );
  }

  handleFrameClick = () => {
    const { url, onClick } = this.extractViewProps();
    if (onClick) {
      onClick();
    } else {
      window.open(url);
    }
  };

  handleAuthorise = (service: AuthService) => {
    const { reload } = this.props;
    auth(service.startAuthUrl).then(() => reload(), () => reload());
  };

  handleErrorRetry = () => {
    const { reload } = this.props;
    reload();
  };

  renderInTheCollapsedFrame(children: React.ReactNode) {
    return (
      <CollapsedFrame
        minWidth={minWidth}
        maxWidth={maxWidth}
        onClick={this.handleFrameClick}
      >
        {children}
      </CollapsedFrame>
    );
  }

  renderResolvingState() {
    return this.renderInTheCollapsedFrame(<ResolvingView />);
  }

  renderUnauthorisedState() {
    const { state } = this.props;
    // TODO: figure out how to support multiple services
    const service = state.services[0];
    return this.renderInTheCollapsedFrame(
      <UnauthorisedView
        icon={this.collapsedIcon}
        service={service ? service.name : ''}
        onAuthorise={service ? () => this.handleAuthorise(service) : undefined}
      />,
    );
  }

  renderForbiddenState() {
    const { state } = this.props;
    // TODO: figure out how to support multiple services
    const service = state.services[0];
    return this.renderInTheCollapsedFrame(
      <ForbiddenView
        icon={this.collapsedIcon}
        onAuthorise={service ? () => this.handleAuthorise(service) : undefined}
      />,
    );
  }

  renderNotFoundState() {
    return this.renderInTheCollapsedFrame(
      <ErroredView message="We couldn't find this link" />,
    );
  }

  renderErroredState() {
    return this.renderInTheCollapsedFrame(
      <ErroredView
        message="We couldn't load this link"
        onRetry={this.handleErrorRetry}
      />,
    );
  }

  renderResolvedState() {
    const props = this.extractViewProps();
    return <ResolvedView {...props} />;
  }

  render() {
    const { state } = this.props;
    switch (state.status) {
      case 'resolving':
        return this.renderResolvingState();

      case 'resolved':
        return this.renderResolvedState();

      case 'unauthorised':
        return this.renderUnauthorisedState();

      case 'forbidden':
        return this.renderForbiddenState();

      case 'not-found':
        return this.renderNotFoundState();

      case 'errored':
        return this.renderErroredState();
    }
  }
}

export interface CardProps {
  client?: Client;
  url: string;
}

export function Card(props: CardProps) {
  const { client, url } = props;
  return (
    <LazyRender
      offset={100}
      placeholder={<ResolvingView />}
      content={
        <WithObject client={client} url={url}>
          {({ state, reload }) => <CardContent state={state} reload={reload} />}
        </WithObject>
      }
    />
  );
}
