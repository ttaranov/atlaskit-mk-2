// @flow
import React, { Component, type Node } from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';
import getAtlassianAnalyticsClient from './AtlassianAnalytics';
import pkgJson from '../../../package.json';
import { GOOGLE_ANALYTICS_ID } from '../../constants';

let mounted = 0;

const getPageLoadNumber = () => {
  if (!window || !window.performance || !window.performance.getEntriesByType) {
    return null;
  }

  let navigationEntries = window.performance.getEntriesByType('navigation');
  if (navigationEntries.length !== 1) return null;

  return Math.round(navigationEntries[0].domComplete);
};

export const initializeGA = () => ReactGA.initialize(GOOGLE_ANALYTICS_ID);

export const sendApdex = (location, timing, isInitial = false) => {
  let apdex = 0;
  if (timing < 1000) apdex = 100;
  else if (timing < 4000) apdex = 50;

  ReactGA.event({
    category: 'Performance',
    action: 'apdex',
    value: apdex,
    nonInteraction: true,
    label: `seconds:${(timing / 1000).toFixed(1)}`,
  });

  const request = getAtlassianAnalyticsClient({
    version: '-',
  });
  const attributes = {
    apdex: apdex,
    loadTimeInMs: timing,
    path: location,
    isInitial,
  };
  request.addEvent(`atlaskit.website.performance`, attributes);
  request.send();
};

export const sendInitialApdex = location => {
  const timing = getPageLoadNumber();
  if (!timing) return null;
  sendApdex(location, timing, true);
};

type Props = {
  children: Node,
  gaId: string,
  location: Object,
};

class GoogleAnalyticsListener extends Component<Props> {
  constructor(props) {
    super(props);
    ReactGA.initialize(GOOGLE_ANALYTICS_ID);
  }

  componentDidMount() {
    window.addEventListener(
      'load',
      () => {
        sendInitialApdex(this.props.location.pathname);
      },
      { once: true },
    );

    mounted++;
    if (mounted > 1) {
      console.warn(
        'There is more than one GoogleAnalyticsListener on the page, this could cause errors',
      );
    }
    initializeGA();
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
    return this.props.children;
  }
}

export default withRouter(GoogleAnalyticsListener);
