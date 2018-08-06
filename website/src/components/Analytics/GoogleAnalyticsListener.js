import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

let mounted = 0;
let sentApdex = 0;

const getApdex = () => {
  if (
    sentApdex ||
    !window ||
    !window.performance ||
    !window.performance.timing ||
    !window.performance.timing.domContentLoadedEventEnd ||
    !window.performance.timing.navigationStart
  ) {
    return null;
  }
  sentApdex++;

  let timing =
    window.performance.timing.domContentLoadedEventEnd -
    window.performance.timing.navigationStart;

  let apdex = 0;
  if (timing < 1000) apdex = 100;
  else if (timing < 4000) apdex = 50;
  // TODO: we could do ReactGA.initialize(props.gaId); here
  ReactGA.event({
    category: 'Performance',
    action: 'apdex',
    value: apdex,
    nonInteraction: true,
  });
};

class GoogleAnalyticsListener extends Component {
  static propTypes = {
    children: PropTypes.node,
    gaId: PropTypes.string,
    location: PropTypes.object,
  };
  constructor(props) {
    super(props);
    ReactGA.initialize(props.gaId);
  }

  /* eslint-disable no-console */
  componentDidMount() {
    // TODO: DOMContentLoaded - From Alex R. we may not need to add a window.addEventListener
    // window.addEventListener('DOMContentLoaded', getApdex, {once: true}) instead of  window.addEventListener('load', getApdex) and call the function;
    // window.addEventListener('load', getApdex);
    getApdex();

    mounted++;
    if (mounted > 1) {
      console.warn(
        'There is more than one GoogleAnalyticsListener on the page, this could cause errors',
      );
    }
    ReactGA.pageview(this.props.location.pathname);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.gaId !== this.props.gaId) {
      console.warn("You can't change the gaId one it has been initialised.");
    }
    if (nextProps.location !== this.props.location) {
      ReactGA.pageview(nextProps.location.pathname);
    }
  }
  componentWillUnmount() {
    mounted--;
  }
  render() {
    const { children } = this.props;
    return children;
  }
}

export default withRouter(GoogleAnalyticsListener);
