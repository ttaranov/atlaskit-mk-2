import { Component } from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

let mounted = 0;

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
