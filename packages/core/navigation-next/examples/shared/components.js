// @flow

import React from 'react';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import { JiraWordmark as JiraWordmarkLogo } from '@atlaskit/logo';

import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import ShipIcon from '@atlaskit/icon/glyph/ship';

import {
  Item as BaseItem,
  ItemPrimitive,
  NavAPISubscriber,
  Section,
  SectionSeparator,
  SectionTitle,
} from '../../src';
import type { GoToItemProps, ItemProps, ViewRendererProps } from './types';

const iconMap = {
  ArrowRightIcon,
  BacklogIcon,
  BoardIcon,
  DashboardIcon,
  GraphLineIcon,
  FolderIcon,
  IssuesIcon,
  ShipIcon,
};

/**
 * ITEMS
 */

// GoToItem
export const GoToItem = ({
  after: afterProp,
  goTo,
  ...rest
}: GoToItemProps) => {
  let after;
  if (typeof afterProp === 'undefined') {
    after = ({ isHover }: *) =>
      isHover ? <ArrowRightIcon size="small" /> : null;
  }

  const props = { ...rest, after };
  return (
    <NavAPISubscriber>
      {api => <Item onClick={() => api.setView(goTo)} {...props} />}
    </NavAPISubscriber>
  );
};

// Item
export const Item = ({ before: beforeProp, icon, ...rest }: ItemProps) => {
  let before = beforeProp;
  if (!before && icon && iconMap[icon]) {
    before = iconMap[icon];
  }

  const props = { ...rest, before };
  return props.goTo ? <GoToItem {...props} /> : <BaseItem {...props} />;
};

// BackItem
const backItemPrimitiveStyles = styles => ({
  ...styles,
  itemBase: { ...styles.itemBase, cursor: 'default' },
});

export const BackItem = ({ goTo, href, subText, text = 'Back' }: *) => (
  <div css={{ display: 'flex', marginBottom: '8px' }}>
    <div css={{ flexShrink: 0 }}>
      <GoToItem
        after={null}
        goTo={goTo}
        href={href}
        text={<ArrowLeftIcon size="small" />}
      />
    </div>
    <div css={{ flexGrow: 1 }}>
      <ItemPrimitive
        spacing="compact"
        styles={backItemPrimitiveStyles}
        subText={subText}
        text={text}
      />
    </div>
  </div>
);

// JiraWordmark
export const JiraWordmark = () => (
  <div css={{ padding: '16px 0' }}>
    <JiraWordmarkLogo />
  </div>
);

// Separator
export const Separator = SectionSeparator;

// Title
export const Title = SectionTitle;

/**
 * GROUPS
 */

const renderItems = items =>
  items.map(({ type, ...props }) => {
    const RenderComponent = components[type];
    return RenderComponent ? <RenderComponent {...props} /> : null;
  });

// Group
export const Group = ({ items }: *) => (
  <div css={{ padding: '0 16px' }}>{renderItems(items)}</div>
);

// Nested
export const Nested = ({ id, items, parentId }: *) => (
  <Section id={id} parentId={parentId}>
    {({ css }) => <div css={css}>{renderItems(items)}</div>}
  </Section>
);

// PluginPoint
export const PluginPoint = ({ items }: *) =>
  items ? <div css={{ padding: '0 16px' }}>{renderItems(items)}</div> : null;

const components = {
  GoToItem,
  Item,
  BackItem,
  JiraWordmark,
  Separator,
  Title,
  Group,
  Nested,
  PluginPoint,
};

/**
 * RENDERER
 */
export const ViewRenderer = ({ view }: ViewRendererProps) => (
  <div css={{ padding: '16px 0' }}>{renderItems(view)}</div>
);
