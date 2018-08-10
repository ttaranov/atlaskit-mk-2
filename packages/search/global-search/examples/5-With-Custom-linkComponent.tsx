import * as React from 'react';
import { setupMocks, teardownMocks } from '../example-helpers/mockApis';
import { GlobalQuickSearch } from '../src';
import withNavigation from '../example-helpers/withNavigation';

const GlobalQuickSearchInNavigation = withNavigation(GlobalQuickSearch);

interface Props {
  className: string;
  href?: string;
  target?: string;
  children: React.ReactNode;
}

class AlertLinkComponent extends React.Component<Props> {
  handleClick = () => {
    const { href } = this.props;
    alert(`href: ${href}`);
  };

  render() {
    const { className, children } = this.props;

    return (
      <span onClick={this.handleClick} className={className}>
        {children}
      </span>
    );
  }
}

export default class extends React.Component {
  componentWillMount() {
    setupMocks();
  }

  componentWillUnmount() {
    teardownMocks();
  }

  render() {
    return <GlobalQuickSearchInNavigation linkComponent={AlertLinkComponent} />;
  }
}
