import * as React from 'react';
import { LocaleAndMessagesIntlProvider } from '../example-helpers/LocaleIntlProvider';
import NoResults from '../src/components/NoResults';
import ConfluenceNoResultState from '../src/components/confluence/NoResultsState';
import JiraeNoResultState from '../src/components/jira/NoResultsState';
import withNavigation from '../example-helpers/withNavigation';

interface Props {
  context: string;
}
class Wrapper extends React.Component<Props> {
  render() {
    const { context } = this.props;
    switch (context) {
      case 'confluence':
        return (
          <LocaleAndMessagesIntlProvider>
            <ConfluenceNoResultState query="confluence-query" />
          </LocaleAndMessagesIntlProvider>
        );
      case 'jira':
        return (
          <LocaleAndMessagesIntlProvider>
            <JiraeNoResultState query="jira-query" />
          </LocaleAndMessagesIntlProvider>
        );
      default:
        return (
          <LocaleAndMessagesIntlProvider>
            <NoResults title="" body="" />
          </LocaleAndMessagesIntlProvider>
        );
    }
  }
}

const WrapperWithNav = withNavigation(Wrapper as any);
export default class extends React.Component {
  render() {
    return <WrapperWithNav />;
  }
}
