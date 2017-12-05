/* tslint:disable:variable-name */
import * as React from 'react';
import StandaloneApplicationCardView from '../src/app_2/StandaloneApplicationCardView';
import FilmstripApplicationCardView from '../src/app_2/FilmstripApplicationCardView';
import * as officialBitbucketCard from './app-card-15/smartcard_bitbucket.json';
import * as officialConfluenceCard from './app-card-15/smartcard_confluence.json';
import * as officialJiraCard from './app-card-15/smartcard_jira.json';
import * as officialServiceDeskCard from './app-card-15/smartcard_servicedesk.json';

function mapMobileToWeb(json: any) {
  return {
    context: json.context,
    icon: json.data.icon,
    preview: json.data.preview,
    title: json.data.title,
    link: json.data.link,
    users: json.data.users,
    details: json.data.details,
    actions: json.data.actions && json.data.actions.actions,
  };
}

const consoleLogAction = (...args) => console.log('action:', ...args);

export default () => (
  <div style={{ padding: '1em' }}>
    <br />
    <StandaloneApplicationCardView
      {...mapMobileToWeb(officialBitbucketCard)}
      onAction={consoleLogAction}
    />
    <br />
    <FilmstripApplicationCardView
      {...mapMobileToWeb(officialBitbucketCard)}
      onAction={consoleLogAction}
    />
    <br />
    <StandaloneApplicationCardView
      {...mapMobileToWeb(officialConfluenceCard)}
      onAction={consoleLogAction}
    />
    <br />
    <FilmstripApplicationCardView
      {...mapMobileToWeb(officialConfluenceCard)}
      onAction={consoleLogAction}
    />
    <br />
    <StandaloneApplicationCardView
      {...mapMobileToWeb(officialJiraCard)}
      onAction={consoleLogAction}
    />
    <br />
    <FilmstripApplicationCardView
      {...mapMobileToWeb(officialJiraCard)}
      onAction={consoleLogAction}
    />
    <br />
    <StandaloneApplicationCardView
      {...mapMobileToWeb(officialServiceDeskCard)}
      onAction={consoleLogAction}
    />
    <br />
    <FilmstripApplicationCardView
      {...mapMobileToWeb(officialServiceDeskCard)}
      onAction={consoleLogAction}
    />
    <br />
  </div>
);
