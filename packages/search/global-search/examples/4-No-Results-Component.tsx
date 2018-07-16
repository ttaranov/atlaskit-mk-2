import * as React from 'react';
import { LocaleAndMessagesIntlProvider } from '../example-helpers/LocaleIntlProvider';
import NoResults from '../src/components/NoResults';

export default class extends React.Component {
  render() {
    return (
      <LocaleAndMessagesIntlProvider>
        <NoResults />
      </LocaleAndMessagesIntlProvider>
    );
  }
}
