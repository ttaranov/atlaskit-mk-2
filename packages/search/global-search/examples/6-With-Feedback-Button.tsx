import * as React from 'react';
import styled from 'styled-components';
import { GlobalQuickSearch } from '../src/index';
import BasicNavigation from '../example-helpers/BasicNavigation';
import { setupMocks, teardownMocks } from '../example-helpers/mockApis';
import { withFeedbackButton } from '../src/index';
import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';

const Outer = styled.div`
  height: 100vh;
`;

const GlobalQuickSearchWithFeedback = withFeedbackButton(GlobalQuickSearch);

// nothing is working except for the feedback button
export default class extends React.Component {
  render() {
    return (
      <Outer>
        <BasicNavigation
          searchDrawerContent={
            <LocaleIntlProvider>
              <GlobalQuickSearchWithFeedback
                cloudId="cloudId"
                context="confluence"
                feedbackCollectorId="a0d6de4d"
              />
            </LocaleIntlProvider>
          }
        />
      </Outer>
    );
  }
}
