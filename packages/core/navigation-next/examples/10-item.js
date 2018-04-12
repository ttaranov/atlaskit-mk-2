// @flow

import React, { type ComponentType } from 'react';
import { ThemeProvider } from 'emotion-theming';
import Badge from '@atlaskit/badge';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import EditIcon from '@atlaskit/icon/glyph/edit';
import Lozenge from '@atlaskit/lozenge';
import Tooltip from '@atlaskit/tooltip';

import { Item, ItemPrimitive, ItemAvatar, light, dark, settings } from '../src';

const themeModes = { light, dark, settings };

const ConfiguredAvatar = itemState => (
  <ItemAvatar itemState={itemState} presence="online" size="small" />
);

const ConfiguredBadge = () => <Badge appearance="primary" value={3} />;

const CloseButton = () => (
  <div css={{ lineHeight: 0 }}>
    <Tooltip content="Close conversation" position="right">
      <CrossIcon size="small" />
    </Tooltip>
  </div>
);

const BadgeOrCloseOnHover = ({ isHover }: { isHover: boolean }) =>
  isHover ? <CloseButton /> : <ConfiguredBadge />;

type ItemType = *;
type VariationCategory = {
  title: string,
  items: Array<ItemType>,
  itemComponent?: ComponentType<ItemType>,
};

const variations: Array<VariationCategory> = [
  {
    title: 'Content variations',
    items: [
      { text: 'Just text' },
      { text: 'Text', subText: 'And sub-text' },
      {
        text: 'Very long text which should truncate',
        subText: 'And very long sub-text which should also truncate',
      },
      {
        before: BoardIcon,
        text: 'Icon before',
      },
      {
        before: ConfiguredAvatar,
        text: 'Avatar before',
      },
      {
        after: () => <Lozenge appearance="success">New</Lozenge>,
        text: 'Lozenge after',
      },
      {
        after: ConfiguredBadge,
        text: 'Badge after',
      },
      {
        after: CloseButton,
        text: 'Action after',
      },
      {
        after: ConfiguredBadge,
        before: BacklogIcon,
        text: 'Before and after',
      },
      {
        after: BadgeOrCloseOnHover,
        before: ConfiguredAvatar,
        text: 'Very long title which should truncate',
        subText: 'Very long sub-text which should truncate',
      },
    ],
  },
  {
    title: 'Spacing variations',
    items: [
      {
        after: EditIcon,
        before: ConfiguredAvatar,
        text: 'Default',
        subText: 'Description',
      },
      {
        after: EditIcon,
        before: ConfiguredAvatar,
        spacing: 'compact',
        text: 'Compact',
        subText: 'My sub-text is smaller',
      },
    ],
  },
  {
    itemComponent: ItemPrimitive,
    title: 'State variations',
    items: [
      {
        after: BadgeOrCloseOnHover,
        before: ConfiguredAvatar,
        text: 'Default',
        subText: 'Sub text',
      },
      {
        after: BadgeOrCloseOnHover,
        before: ConfiguredAvatar,
        isHover: true,
        text: 'Hover',
        subText: 'Sub text',
      },
      {
        after: BadgeOrCloseOnHover,
        before: ConfiguredAvatar,
        isActive: true,
        isHover: true,
        text: 'Hover + active',
        subText: 'Sub text',
      },
      {
        after: BadgeOrCloseOnHover,
        before: ConfiguredAvatar,
        isSelected: true,
        text: 'Selected',
        subText: 'Sub text',
      },
      {
        after: BadgeOrCloseOnHover,
        before: ConfiguredAvatar,
        isHover: true,
        isSelected: true,
        text: 'Selected + hover',
        subText: 'Sub text',
      },
      {
        after: BadgeOrCloseOnHover,
        before: ConfiguredAvatar,
        isActive: true,
        isHover: true,
        isSelected: true,
        text: 'Selected + hover + active',
        subText: 'Sub text',
      },
    ],
  },
  {
    itemComponent: ({
      themeContext: context,
      themeMode: mode,
      ...props
    }: ItemType) => (
      <ThemeProvider
        theme={theme => ({
          ...theme,
          context,
          mode: themeModes[mode],
        })}
      >
        <Item {...props} />
      </ThemeProvider>
    ),
    title: 'Theme variations',
    items: [
      {
        before: ConfiguredAvatar,
        text: 'Light mode, container context',
        subText: 'Sub text',
        themeMode: 'light',
        themeContext: 'container',
      },
      {
        before: ConfiguredAvatar,
        text: 'Light mode, root context',
        subText: 'Sub text',
        themeMode: 'light',
        themeContext: 'root',
      },
      {
        before: ConfiguredAvatar,
        text: 'Dark mode, container context',
        subText: 'Sub text',
        themeMode: 'dark',
        themeContext: 'container',
      },
      {
        before: ConfiguredAvatar,
        text: 'Dark mode, root context',
        subText: 'Sub text',
        themeMode: 'dark',
        themeContext: 'root',
      },
      {
        before: ConfiguredAvatar,
        text: 'Settings mode, container context',
        subText: 'Sub text',
        themeMode: 'settings',
        themeContext: 'container',
      },
      {
        before: ConfiguredAvatar,
        text: 'Settings mode, root context',
        subText: 'Sub text',
        themeMode: 'settings',
        themeContext: 'root',
      },
    ],
  },
  {
    title: 'Component variations',
    items: [
      {
        href: '#',
        subText: '<a>',
        target: '_blank',
        text: 'Anchor',
      },
      {
        onClick: () => console.log('You clicked a button'),
        subText: '<button>',
        text: 'Button',
      },
      {
        subText: '<span>',
        text: 'Span',
      },
      {
        component: ({ children, className }: *) => (
          <div className={className} to="/">
            {children}
          </div>
        ),
        subText: "Pretend I'm a react-router <Link>",
        text: 'Custom component',
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
  <div css={{ margin: '4px 0', width: '270px' }} {...props} />
);

export default () => (
  <Container>
    {variations.map(({ title, items, itemComponent: ItemComponent = Item }) => (
      <VariationWrapper key={title}>
        <h3>{title}</h3>
        {items.map(item => (
          <ItemWrapper key={item.text}>
            <ItemComponent {...item} />
          </ItemWrapper>
        ))}
      </VariationWrapper>
    ))}
  </Container>
);
