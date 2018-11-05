// @flow

import React, { Fragment, Component } from 'react';
import Spinner from '@atlaskit/spinner';

import { externalContent, spinnerWrapper } from './styles';
import addParamToUrl from '../../add-param-to-url';

export const CONTENT_URL = '/home/notificationsDrawer/iframe.html';
type Props = {|
  locale?: string,
  product?: string,
  window?: {
    addEventListener: (string, (any) => void) => void,
    removeEventListener: (string, (any) => void) => void,
  },
|};

type State = {|
  hasIframeLoaded: boolean,
|};

class NotificationDrawer extends Component<Props, State> {
  static defaultProps = {
    window,
  };

  state = {
    hasIframeLoaded: false,
  };

  componentDidMount() {
    if (this.props.window)
      this.props.window.addEventListener('message', this.handleMessage);
  }

  componentWillUnmount() {
    if (this.props.window)
      this.props.window.removeEventListener('message', this.handleMessage);
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
    const { locale, product } = this.props;
    let drawerUrl = CONTENT_URL;
    drawerUrl = locale ? addParamToUrl(drawerUrl, 'locale', locale) : drawerUrl;
    drawerUrl = product
      ? addParamToUrl(drawerUrl, 'product', product)
      : drawerUrl;

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
