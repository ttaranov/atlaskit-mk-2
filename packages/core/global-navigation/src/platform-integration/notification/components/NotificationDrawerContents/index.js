// @flow

import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import { Event } from 'chrome-trace-event';
import Spinner from '@atlaskit/spinner';

import addParamToUrl from '../../add-param-to-url';

const ExternalContent = styled.iframe`
  visibility: ${props => (props.hasIframeLoaded ? 'visible' : 'hidden')};
  height: 100%;
  width: 100%;
  border: 0;
  flex: 1 1 auto;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  top: 11.25rem;
`;

type Props = {|
  externalContentUrl: string,
  locale?: string,
  product?: string,
|};

type State = {|
  hasIframeLoaded: boolean,
|};

class NotificationDrawer extends Component<Props, State> {
  state = {
    hasIframeLoaded: false,
  };

  componentDidMount() {
    window.addEventListener('message', this.handleMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage);
  }

  iframe = null;

  handleMessage = (event: Event) => {
    if (
      event.source &&
      this.iframe &&
      event.source.window === this.iframe.contentWindow &&
      event.data === 'readyForUser'
    ) {
      this.setState({ hasIframeLoaded: true });
    }
  };

  handleIframeLoad = () => {
    this.setState({ hasIframeLoaded: true });
  };

  storeIFrame = (component: any) => {
    this.iframe = component;
  };

  render() {
    const { externalContentUrl, locale, product } = this.props;
    let drawerUrl = externalContentUrl;
    drawerUrl = locale
      ? addParamToUrl(externalContentUrl, 'locale', locale)
      : drawerUrl;
    drawerUrl = product
      ? addParamToUrl(externalContentUrl, 'product', product)
      : drawerUrl;

    return (
      <Fragment>
        {!this.state.hasIframeLoaded && (
          <SpinnerWrapper>
            <Spinner size="large" isCompleting={this.state.hasIframeLoaded} />
          </SpinnerWrapper>
        )}
        <ExternalContent
          ref={this.storeIFrame}
          title="Notifications"
          src={drawerUrl}
          onLoad={this.handleIframeLoad}
          hasIframeLoaded={this.state.hasIframeLoaded}
        />
      </Fragment>
    );
  }
}

export default NotificationDrawer;
