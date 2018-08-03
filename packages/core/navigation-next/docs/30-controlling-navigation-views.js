// @flow

import React from 'react';
import { code, md } from '@atlaskit/docs';

import { Contents, ContentsProvider, IframeExample, H } from './shared';

export default (
  <ContentsProvider>{md`
This guide will introduce you to some of the more advanced concepts in navigation-next.

${<Contents listType="ol" />}

${<H>Navigation views</H>}

If you've followed the previous guide you'll know how to use the UI components to compose a navigation. This is all well and good if your navigation is simple and will never change as the user navigates around your app. But what if we do want to change the state of our navigation?

We refer to each state the navigation can be in as a 'view'. As an example, here are some of Jira's navigation 'views':

${(
    <IframeExample
      source={require('!!raw-loader!../examples/9999-views-controller-views-example')}
      title="Navigation views"
      url="/examples.html?groupId=core&packageId=navigation-next&exampleId=views-controller-views-example"
    />
  )}

${<H>Representing a view as data</H>}

Representing a view as a Javascript array makes it really easy for us to work with this data. Let's start by taking the Product home view above and turning it into JSON.

${code`// Component representation
const componentView = (
  <Fragment>
    <Section key="header">
      {({ className }) => (
        <div className={className}>
          <div css={{ padding: '16px 0' }}>
            <JiraWordmark />
          </div>
        </div>
      )}
    </Section>
    <Section key="menu">
      {({ className }) => (
        <div className={className}>
          <Item before={DashboardIcon} text="Dashboards" />
          <Item before={FolderIcon} text="Projects" />
          <Item before={IssueIcon} text="Issues and filters" />
          <Item before={PortfolioIcon} text="Portfolio" />
        </div>
      )}
    </Section>
  </Fragment>
);

// JSON representation
const jsonView = [
  {
    type: 'Section',
    key: 'header',
    items: [
      {
        type: () => (
          <div css={{ padding: '16px 0' }}>
            <JiraWordmark />
          </div>
        ),
        key: 'jira-wordmark',
      },
    ],
  },
  {
    type: 'Section',
    key: 'header',
    items: [
      { type: 'Item' before: DashboardIcon, text: 'Dashboards' },
      { type: 'Item' before: FolderIcon, text: 'Projects' },
      { type: 'Item' before: IssueIcon, text: 'Issues and filters' },
      { type: 'Item' before: PortfolioIcon, text: 'Portfolio' },
    ],
  },
];`}

In this model a view is represented as an array of items. Each item in this array has a \`type\` property, a \`key\` property, and maybe an \`items\` property (if this item contains other items).

A few things to note:

* Some \`type\`s are built in to the package (such as, 'Item' and 'Section') and these types can be provided as a string. In the above example the Jira wordmark component isn't built-in to \`navigation-next\`, but we can provide a component as the type.
* A view is expected to be an array of Sections. Sections should not be nested.
* You can find a complete list of the in-built item types here. **INSERT LINK HERE AT SOME POINT**

`}</ContentsProvider>
);
