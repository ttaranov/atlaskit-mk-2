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
    window.addEventListener('load', getApdex);

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
