// @flow
import React from 'react';
import { GlobalItem } from '@atlaskit/navigation-next';
import {
  BitbucketIcon,
  ConfluenceIcon,
  JiraCoreIcon,
  JiraIcon,
  JiraServiceDeskIcon,
  JiraSoftwareIcon,
  StrideIcon,
} from '../src';

type ItemType = *;

type VariationCategory = {
  title: string,
  items: Array<ItemType>,
  itemComponent?: ComponentType<ItemType>,
};

const icons: Array<VariationCategory> = [
  {
    title: 'Icons',
    items: [
      {
        description: 'Bitbucket',
        icon: BitbucketIcon,
        size: 'large',
      },
      {
        description: 'Confluence',
        icon: ConfluenceIcon,
        size: 'large',
      },
      {
        description: 'JiraCore',
        icon: JiraCoreIcon,
        size: 'large',
      },
      {
        description: 'Jira',
        icon: JiraIcon,
        size: 'large',
      },
      {
        description: 'Jira Software',
        icon: JiraSoftwareIcon,
        size: 'large',
      },
      {
        description: 'Jira Service Desk',
        icon: JiraServiceDeskIcon,
        size: 'large',
      },
      {
        description: 'Stride',
        icon: StrideIcon,
        size: 'large',
      },
    ],
  },
];

const Container = props => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    }}
    {...props}
  />
);
const VariationWrapper = props => (
  <div css={{ margin: '0 24px 24px 0' }} {...props} />
);
const ItemWrapper = props => (
  <div
    css={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      margin: '4px 0',
      width: '270px',
    }}
    {...props}
  />
);
const Description = ({ size, children }: ItemType) => (
  <div
    css={{
      marginLeft: '16px',
      marginTop: size === 'small' ? '8px' : '0',
    }}
  >
    {children}
  </div>
);

export default () => (
  <Container>
    {icons.map(
      ({ title, items, itemComponent: ItemComponent = GlobalItem }) => (
        <VariationWrapper key={title}>
          <h3>{title}</h3>
          {items.map(({ description, ...item }) => (
            <ItemWrapper key={description}>
              <ItemComponent {...item} />
              <Description {...item}>{description}</Description>
            </ItemWrapper>
          ))}
        </VariationWrapper>
      ),
    )}
  </Container>
);
