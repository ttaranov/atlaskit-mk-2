/* tslint:disable:no-console */
import * as React from 'react';
import { AppCardView, AppCardModel } from '../src';
import { Section } from './app-card/styled';
import * as bitbucketPullRequest1 from './app-card/bitbucket-pull-request1.json';
import * as bitbucketPullRequest2 from './app-card/bitbucket-pull-request2.json';
import * as confluence from './app-card/confluence.json';
import * as jiraTask from './app-card/jira-task.json';
import * as jiraBug from './app-card/jira-bug.json';
import * as jiraImprovement from './app-card/jira-improvement.json';
import * as jiraStory from './app-card/jira-story.json';
import * as statuspageComponentOperational from './app-card/statuspage-component-operational.json';
import * as statuspageComponentDegraded from './app-card/statuspage-component-degraded.json';
import * as statuspageIncidentResolved from './app-card/statuspage-incident-resolved.json';
import * as statuspageIncidentOutage from './app-card/statuspage-incident-outage.json';
import * as github from './app-card/github.json';

export default () => (
  <div>
    <h1>AppCardView: Examples</h1>

    <Section title="Bitbucket">
      <AppCardView model={bitbucketPullRequest1 as AppCardModel} />
      <AppCardView model={bitbucketPullRequest1 as AppCardModel} />
      <AppCardView model={bitbucketPullRequest2 as AppCardModel} />
      <AppCardView model={bitbucketPullRequest2 as AppCardModel} />
    </Section>

    <Section title="Confluence">
      <AppCardView model={confluence as AppCardModel} />
      <AppCardView model={confluence as AppCardModel} />
    </Section>

    <Section title="Jira">
      <AppCardView model={jiraTask as AppCardModel} />
      <AppCardView model={jiraTask as AppCardModel} />
      <AppCardView model={jiraBug as AppCardModel} />
      <AppCardView model={jiraBug as AppCardModel} />
      <AppCardView model={jiraImprovement as AppCardModel} />
      <AppCardView model={jiraImprovement as AppCardModel} />
      <AppCardView model={jiraStory as AppCardModel} />
      <AppCardView model={jiraStory as AppCardModel} />
    </Section>

    <Section title="StatusPage">
      <AppCardView model={statuspageComponentOperational as AppCardModel} />
      <AppCardView model={statuspageComponentOperational as AppCardModel} />
      <AppCardView model={statuspageComponentDegraded as AppCardModel} />
      <AppCardView model={statuspageComponentDegraded as AppCardModel} />
      <AppCardView model={statuspageIncidentResolved as AppCardModel} />
      <AppCardView model={statuspageIncidentResolved as AppCardModel} />
      <AppCardView model={statuspageIncidentOutage as AppCardModel} />
      <AppCardView model={statuspageIncidentOutage as AppCardModel} />
    </Section>

    <Section title="Github">
      <AppCardView model={github as AppCardModel} />
      <AppCardView model={github as AppCardModel} />
    </Section>
  </div>
);
