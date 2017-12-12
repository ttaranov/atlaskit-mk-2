import { storiesOf } from '@kadira/storybook';
import React from 'react';
import Tooltip from '@atlaskit/tooltip';

import ChangingColorWithProps from './ChangingColorWithProps';
import ChangingColorWithInheritance from './ChangingColorWithInheritance';
import components from '../docs/icons';
import { name } from '../package.json';

const AtlassianIcon = components.atlassian.component;
const BitbucketIcon = components.bitbucket.component;
const ConfluenceIcon = components.confluence.component;
const HipchatIcon = components.hipchat.component;
const JiraIcon = components.jira.component;
const StrideIcon = components.stride.component;
const JiraCoreIcon = components['jira-core'].component;
const JiraSoftwareIcon = components['jira-software'].component;
const JiraServiceDeskIcon = components['jira-service-desk'].component;
const StatuspageIcon = components.statuspage.component;

if (!AtlassianIcon) {
  throw new Error(
    'Atlassian icon was removed but is needed to display stories properly',
  );
}

storiesOf(`${name} - logos`, module)
  .add('Changing colour via inheritance', () => {
    const flagshipIcons = [
      [AtlassianIcon, 'Atlassian'],
      [BitbucketIcon, 'Bitbucket'],
      [ConfluenceIcon, 'Confluence'],
      [HipchatIcon, 'Hipchat'],
      [JiraCoreIcon, 'Jira Core'],
      [JiraIcon, 'Jira'],
      [JiraServiceDeskIcon, 'Jira Service Desk'],
      [JiraSoftwareIcon, 'Jira Software'],
      [StatuspageIcon, 'Statuspage'],
      [StrideIcon, 'Stride'],
    ];

    return (
      <ChangingColorWithInheritance>
        {flagshipIcons.map(([Icon, label], key) => (
          <Tooltip content={label} key={key}>
            <Icon size="xlarge" label={label} />
          </Tooltip>
        ))}
      </ChangingColorWithInheritance>
    );
  })
  .add('Changing colour via props', () => {
    const flagshipIcons = [
      [AtlassianIcon, 'Atlassian'],
      [BitbucketIcon, 'Bitbucket'],
      [ConfluenceIcon, 'Confluence'],
      [HipchatIcon, 'Hipchat'],
      [JiraCoreIcon, 'Jira Core'],
      [JiraIcon, 'Jira'],
      [JiraServiceDeskIcon, 'Jira Service Desk'],
      [JiraSoftwareIcon, 'Jira Software'],
      [StatuspageIcon, 'Statuspage'],
      [StrideIcon, 'Stride'],
    ];

    return <ChangingColorWithProps icons={flagshipIcons} />;
  });
