import * as React from 'react';
import SearchError from '../src/components/SearchError';

export default class extends React.Component {
  render() {
    const handleRetry = () => alert('haha error. Try again.');

    return <SearchError onRetry={handleRetry} />;
  }
}
