// @flow

import React from 'react';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
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
} from '../';
import type {
  GoToItemProps,
  ItemProps,
  ItemsRendererProps,
  TitleProps,
} from './types';

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
const GoToItem = ({ after: afterProp, goTo, ...rest }: GoToItemProps) => {
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
const Item = ({ before: beforeProp, icon, ...rest }: ItemProps) => {
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

const BackItem = ({ goTo, href, subText, text = 'Back' }: *) => (
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

// Separator
const Separator = SectionSeparator;

// Title
const Title = ({ text, ...props }: TitleProps) => (
  <SectionTitle {...props}>{text}</SectionTitle>
);

const Debug = props => (
  <pre
    css={{
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      fontSize: '10px',
      padding: '4px',
    }}
  >
    {JSON.stringify(props, null, 2)}
  </pre>
);

/**
 * GROUPS
 */

// Group
const Group = ({ items, customComponents }: *) => (
  <div css={{ padding: '0 16px' }}>
    <ItemsRenderer items={items} customComponents={customComponents} />
  </div>
);

// Nested
const Nested = ({ customComponents, id, items, parentId }: *) => (
  <Section id={id} parentId={parentId}>
    {({ css }) => (
      <div css={css}>
        <ItemsRenderer items={items} customComponents={customComponents} />
      </div>
    )}
  </Section>
);

const itemComponents = {
  Debug,
  GoToItem,
  Item,
  BackItem,
  Separator,
  Title,
};

const groupComponents = {
  Group,
  Nested,
};

const components = { ...itemComponents, ...groupComponents };

/**
 * RENDERER
 */
export const ItemsRenderer = ({
  customComponents = {},
  items,
}: ItemsRendererProps) => {
  return items.map(({ type, ...props }) => {
    if (groupComponents[type]) {
      const G = groupComponents[type];
      return (
        <G key={props.id} {...props} customComponents={customComponents} />
      );
    }

    if (itemComponents[type]) {
      const I = itemComponents[type];
      return <I key={props.id} {...props} />;
    }

    if (customComponents[type]) {
      const C = customComponents[type];
      return (
        <C
          key={props.id}
          {...props}
          components={components}
          customComponents={customComponents}
        />
      );
    }

    return <Debug key={props.id} type={type} {...props} />;
  });
};
