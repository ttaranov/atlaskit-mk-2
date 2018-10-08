// @flow

import React, { Fragment, Component } from 'react';
import Spinner from '@atlaskit/spinner';

import { externalContent, spinnerWrapper } from './styles';
import addParamToUrl from '../../add-param-to-url';

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

    console.log(externalContent, spinnerWrapper);
    return (
      <Fragment>
        {!this.state.hasIframeLoaded && (
          <div css={spinnerWrapper}>
            <Spinner size="large" isCompleting={this.state.hasIframeLoaded} />
          </div>
        )}
        <iframe
          css={externalContent(!!this.state.hasIframeLoaded)}
          ref={this.storeIFrame}
          title="Notifications"
          src={drawerUrl}
          onLoad={this.handleIframeLoad}
        />
      </Fragment>
    );
  }
}

export default NotificationDrawer;
