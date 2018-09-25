/* tslint:disable:no-console */
import * as React from 'react';
import { AppCardView, AppCardModel } from '../src/app_2/AppCardViewV2';
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

const newDesign = true;

// cast to AppCardModel to make typescript happy
function convert(json: any): AppCardModel {
  return json;
}

export default () => (
  <div>
    <div>
      <h1>AppCardView: Examples</h1>

      <Section title="Bitbucket">
        <AppCardView model={convert(bitbucketPullRequest1)} />
        <AppCardView
          newDesign={newDesign}
          model={convert(bitbucketPullRequest1)}
        />
        <AppCardView model={convert(bitbucketPullRequest2)} />
        <AppCardView
          newDesign={newDesign}
          model={convert(bitbucketPullRequest2)}
        />
      </Section>

      <Section title="Confluence">
        <AppCardView model={convert(confluence)} />
        <AppCardView newDesign={newDesign} model={convert(confluence)} />
      </Section>

      <Section title="Jira">
        <AppCardView model={convert(jiraTask)} />
        <AppCardView newDesign={newDesign} model={convert(jiraTask)} />
        <AppCardView model={convert(jiraBug)} />
        <AppCardView newDesign={newDesign} model={convert(jiraBug)} />
        <AppCardView model={convert(jiraImprovement)} />
        <AppCardView newDesign={newDesign} model={convert(jiraImprovement)} />
        <AppCardView model={convert(jiraStory)} />
        <AppCardView newDesign={newDesign} model={convert(jiraStory)} />
      </Section>

      <Section title="StatusPage">
        <AppCardView model={convert(statuspageComponentOperational)} />
        <AppCardView
          newDesign={newDesign}
          model={convert(statuspageComponentOperational)}
        />
        <AppCardView model={convert(statuspageComponentDegraded)} />
        <AppCardView
          newDesign={newDesign}
          model={convert(statuspageComponentDegraded)}
        />
        <AppCardView model={convert(statuspageIncidentResolved)} />
        <AppCardView
          newDesign={newDesign}
          model={convert(statuspageIncidentResolved)}
        />
        <AppCardView model={convert(statuspageIncidentOutage)} />
        <AppCardView
          newDesign={newDesign}
          model={convert(statuspageIncidentOutage)}
        />
      </Section>

      <Section title="Github">
        <AppCardView model={convert(github)} />
        <AppCardView newDesign={newDesign} model={convert(github)} />
      </Section>
    </div>
  </div>
);
