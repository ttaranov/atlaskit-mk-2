declare var window: any;
import * as React from 'react';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';
import Button from '@atlaskit/button';
import { FormattedMessage } from 'react-intl';
import { messages } from '@atlaskit/media-ui';
import { FeedbackWrapper } from './styled';

// The following function fetches the code to show a JIRA issue collector.
// It inserts a script element into the document and then waits until
// `ATL_JQ_PAGE_PROPS.triggerFunction` is invoked.
// The results of the fetch are cached.
declare global {
  interface Window {
    ATL_JQ_PAGE_PROPS: any;
  }
}

type ShowIssueCollectorFn = () => void;

const loadIssueCollector: () => Promise<ShowIssueCollectorFn> = (function() {
  const COLLECTOR_ID = '6b29563e';
  const ISSUE_COLLECTOR_URL = `https://product-fabric.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-t6xhtk/b/5/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=${COLLECTOR_ID}`;
  let showIssueCollector: Promise<ShowIssueCollectorFn>;
  return () => {
    if (!showIssueCollector) {
      showIssueCollector = new Promise(resolve => {
        window.ATL_JQ_PAGE_PROPS = {
          triggerFunction(showIssueCollector: ShowIssueCollectorFn) {
            resolve(showIssueCollector);
          },
        };
        window.jQuery.ajax({
          url: ISSUE_COLLECTOR_URL,
          type: 'get',
          cache: true,
          dataType: 'script',
        });
      });
    }
    return showIssueCollector;
  };
})();

export class FeedbackButton extends React.Component<{}, {}> {
  render() {
    const isJQueryAvailable = typeof window.jQuery !== 'undefined';
    if (!isJQueryAvailable) {
      return null;
    }
    return (
      <FeedbackWrapper>
        <Button
          appearance="toolbar"
          onClick={this.showFeedbackDialog}
          iconBefore={<FeedbackIcon label="feedback" />}
        >
          <FormattedMessage {...messages.give_feedback} />
        </Button>
      </FeedbackWrapper>
    );
  }

  private showFeedbackDialog = () => {
    loadIssueCollector().then(
      showIssueCollector => {
        showIssueCollector();
      },
      _ => {
        /* do nothing */
      },
    );
  };
}
