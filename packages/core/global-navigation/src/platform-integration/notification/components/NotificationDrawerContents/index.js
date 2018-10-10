// @flow

import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import Spinner from '@atlaskit/spinner';

import addParamToUrl from '../../add-param-to-url';

const ExternalContent = styled.iframe`
  visibility: ${props => (props.hasIframeLoaded ? 'visible' : 'hidden')};
  height: 100%;
  width: 100%;
  border: 0;
  flex: 1 1 auto;
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

  handleMessage = (event: any) => {
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              width: '100%',
              height: '100%',
              alignItems: 'center',
            }}
          >
            <Spinner size="large" isCompleting={false} />
          </div>
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
