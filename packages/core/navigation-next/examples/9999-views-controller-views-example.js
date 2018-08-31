// @flow

import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import ComponentIcon from '@atlaskit/icon/glyph/component';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import IssueIcon from '@atlaskit/icon/glyph/issue';
import PageIcon from '@atlaskit/icon/glyph/page';
import PortfolioIcon from '@atlaskit/icon/glyph/portfolio';
import ShipIcon from '@atlaskit/icon/glyph/ship';
import { JiraWordmark } from '@atlaskit/logo';
import { colors } from '@atlaskit/theme';

import {
  ContainerHeader,
  GroupHeading,
  Item,
  ItemAvatar,
  light,
  Section,
  Separator,
} from '../src';

const FakeContentNav = ({ isContainer = false, ...props }: any) => (
  <ThemeProvider
    theme={() => ({
      context: isContainer ? 'container' : 'product',
      mode: light,
    })}
  >
    <div
      css={{
        backgroundColor: isContainer ? colors.N20 : colors.B500,
        color: isContainer ? colors.N500 : colors.B50,
        flexGrow: 1,
        padding: '8px 0',
        width: 270,
      }}
      {...props}
    />
  </ThemeProvider>
);

const FlexColumn = (props: any) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'column',
      marginRight: 16,
    }}
    {...props}
  />
);

export default () => (
  <div css={{ display: 'flex', alignItems: 'stretch' }}>
    <FlexColumn>
      <h3>Product home view</h3>
      <FakeContentNav>
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
              <Item before={DashboardIcon} text="Dashboards" isSelected />
              <Item before={FolderIcon} text="Projects" />
              <Item before={IssueIcon} text="Issues and filters" />
              <Item before={PortfolioIcon} text="Portfolio" />
            </div>
          )}
        </Section>
      </FakeContentNav>
    </FlexColumn>
    <FlexColumn>
      <h3>Product issues view</h3>
      <FakeContentNav>
        <Section key="header">
          {({ className }) => (
            <div className={className}>
              <div css={{ padding: '16px 0 8px' }}>
                <JiraWordmark />
              </div>
              <div css={{ marginBottom: 16 }}>
                <Item before={ArrowLeftIcon} text="Back" />
              </div>
            </div>
          )}
        </Section>
        <Section key="menu">
          {({ className }) => (
            <div className={className}>
              <Item text="Search issues" />
              <GroupHeading>Other</GroupHeading>
              <Item text="My open issues" />
              <Item text="Reported by me" />
              <Item text="All issues" />
              <Item text="Open issues" />
              <Item text="Done issues" />
              <Item text="Viewed recently" />
              <Item text="Created recently" />
              <Item text="Resolved recently" />
              <Item text="Updated recently" />
              <Separator />
              <Item text="View all filters" />
            </div>
          )}
        </Section>
      </FakeContentNav>
    </FlexColumn>
    <FlexColumn>
      <h3>Project backlog view</h3>
      <FakeContentNav isContainer>
        <Section key="header">
          {({ className }) => (
            <div className={className}>
              <div css={{ padding: '8px 0' }}>
                <ContainerHeader
                  before={itemState => (
                    <ItemAvatar itemState={itemState} appearance="square" />
                  )}
                  subText="Project description"
                  text="Project name"
                />
              </div>
            </div>
          )}
        </Section>
        <Section key="menu">
          {({ className }) => (
            <div className={className}>
              <Item before={BacklogIcon} text="Backlog" />
              <Item before={BoardIcon} text="Active sprints" />
              <Item before={GraphLineIcon} text="Reports" />
              <Separator />
              <Item before={ShipIcon} text="Releases" />
              <Item before={IssueIcon} text="Issues and filters" />
              <Item before={PageIcon} text="Pages" />
              <Item before={ComponentIcon} text="Components" />
            </div>
          )}
        </Section>
      </FakeContentNav>
    </FlexColumn>
  </div>
);
