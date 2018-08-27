import * as React from 'react';
import { LocaleAndMessagesIntlProvider } from '../example-helpers/LocaleIntlProvider';
import SearchError from '../src/components/SearchError';

export default class extends React.Component {
  render() {
    const handleRetry = () => alert('haha error. Try again.');

    return (
      <LocaleAndMessagesIntlProvider>
        <SearchError onRetryClick={handleRetry} />
      </LocaleAndMessagesIntlProvider>
    );
  }
}
