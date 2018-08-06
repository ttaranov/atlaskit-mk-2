import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';

// collector id for QS in Confluence = 'b7e38976';
// See: https://jira.atlassian.com/secure/ViewCollector!default.jspa?projectKey=FEEDBACK&collectorId=b7e38976

// Use collectorId = 'a0d6de4d' if you want to test the feedback component without submitting real feedback items
// See: https://jira.atlassian.com/secure/ViewCollector!default.jspa?projectKey=FEEDBACK&collectorId=a0d6de4d

const config: ServiceConfig = {
  url: 'https://pf-feedback-proxy.us-east-1.staging.public.atl-paas.net',
};

function webInfo() {
  return `
Domain: ${window.location.hostname}
User-Agent: ${navigator.userAgent}
Screen Resolution: ${screen.width} x ${screen.height}
  `;
}

function truncate(text: string) {
  if (text.length < 50) {
    return text;
  }
  return text.substring(0, 49) + '...';
}

export default async function sendFeedback(
  summary: string,
  collectorId: string,
) {
  const data = {
    collectorId: collectorId,
    data: {
      summary: truncate(summary),
      description: summary,
      webInfo: webInfo(),
    },
  };

  const options: RequestServiceOptions = {
    path: 'api/feedback',
    requestInit: {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    },
  };

  return await utils.requestService(config, options);
}
