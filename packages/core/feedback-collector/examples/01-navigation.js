// @flow
import React from 'react';
import GlobalNavigation from '@atlaskit/global-navigation';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';
import { AtlassianIcon, AtlassianWordmark } from '@atlaskit/logo';
import {
  ContainerHeader,
  GroupHeading,
  Item,
  ItemAvatar,
  LayoutManager,
  NavigationProvider,
  Section,
  Separator,
} from '@atlaskit/navigation-next';

import FeedbackCollector from '../src/';

const EMBEDDABLE_KEY = 'your_jsd_embeddable_key';
const REQUEST_TYPE_ID = 'your_jsd_request_type_id';
const name = 'Feedback Sender';
const email = 'fsender@atlassian.com';

const MyGlobalNavigation = () => (
  <GlobalNavigation
    productIcon={() => <AtlassianIcon size="medium" />}
    onProductClick={() => {}}
  />
);

const MyProductNavigation = () => (
  <div css={{ padding: '16px 0' }}>
    <Section>
      {({ className }) => (
        <div className={className}>
          <div css={{ padding: '8px 0' }}>
            <AtlassianWordmark />
          </div>
        </div>
      )}
    </Section>
    <Section>
      {({ className }) => (
        <div className={className}>
          <Item text="Dashboard" />
          <Item text="Things" />
          <Item text="Settings" />
          <Separator />
          <GroupHeading>Add-ons</GroupHeading>
          <Item text="My plugin" />
        </div>
      )}
    </Section>
  </div>
);
const MyContainerNavigation = () => (
  <div css={{ padding: '16px 0' }}>
    <Section>
      {({ className }) => (
        <div className={className}>
          <ContainerHeader
            before={itemState => (
              <ItemAvatar
                itemState={itemState}
                appearance="square"
                src="https://ecosystem.atlassian.net/secure/projectavatar?pid=12870&amp;avatarId=10011"
              />
            )}
            text="Customer Feedback"
            subText="Project to store customer feedback"
          />
        </div>
      )}
    </Section>
    <Section>
      {({ className }) => (
        <div className={className}>
          <Item text="Dashboards" />
          <Item text="Reports" />
          <Separator />
          <GroupHeading>Feedback</GroupHeading>
          <Item
            before={FeedbackIcon}
            text="Give Feedback"
            onClick={() => (
              <FeedbackCollector
                onClose={() => {}}
                onSubmit={() => {}}
                email={email}
                name={name}
                requestTypeId={REQUEST_TYPE_ID}
                embeddableKey={EMBEDDABLE_KEY}
              />
            )}
          />
        </div>
      )}
    </Section>
  </div>
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={MyGlobalNavigation}
      productNavigation={MyProductNavigation}
      containerNavigation={MyContainerNavigation}
    >
      <div>Page content goes here.</div>
    </LayoutManager>
  </NavigationProvider>
);
