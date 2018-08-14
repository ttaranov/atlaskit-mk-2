// @flow

import React, { type Node } from 'react';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import ShipIcon from '@atlaskit/icon/glyph/ship';
import { gridSize as gridSizeFn } from '@atlaskit/theme';

import { navigationItemClicked } from '../common/analytics';
import ContainerHeader from '../components/ContainerHeader';
import BaseItem from '../components/Item';
import ItemPrimitive from '../components/Item/primitives';
import SectionComponent from '../components/Section';
import Separator from '../components/Separator';
import GroupComponent from '../components/Group';
import GroupHeadingComponent from '../components/GroupHeading';
import Switcher from '../components/Switcher';
import { withNavigationUI } from '../ui-controller';
import { withNavigationViewController } from '../view-controller';
import type {
  GoToItemProps,
  GroupProps,
  ItemProps,
  ItemsRendererProps,
  SectionProps,
  GroupHeadingProps,
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

const gridSize = gridSizeFn();

const AnalyticsWrapper = ({
  children,
  onClick,
}: {
  children: Node,
  onClick: () => void,
}) => (
  <div role="presentation" onClick={onClick}>
    {children}
  </div>
);

/**
 * ITEMS
 */

// GoToItem
const GoToItemBase = ({
  after: afterProp,
  goTo,
  navigationUIController,
  navigationViewController,
  ...rest
}: GoToItemProps) => {
  let after;
  if (typeof afterProp === 'undefined') {
    after = ({ isActive, isHover }: *) =>
      isActive || isHover ? <ArrowRightIcon size="small" /> : null;
  }

  const props = { ...rest, after };
  const handleClick = e => {
    e.preventDefault();

    const { activeView } = navigationViewController.state;

    if (navigationUIController.state.isPeeking) {
      if (activeView && goTo === activeView.id) {
        // If we're peeking and goTo points to the active view, unpeek.
        navigationUIController.unPeek();
      } else {
        // If we're peeking and goTo does not point to the active view, update
        // the peek view.
        navigationViewController.setPeekView(goTo);
      }
    } else {
      // If we're not peeking, update the active view.
      navigationViewController.setView(goTo);
    }
  };

  return <Item onClick={e => handleClick(e)} {...props} />;
};
const GoToItem = withNavigationUI(withNavigationViewController(GoToItemBase));

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

const BackItem = ({ goTo, href, subText, id, index, text = 'Back' }: *) => (
  <div css={{ display: 'flex', marginBottom: '8px' }}>
    <div css={{ flexShrink: 0 }}>
      <GoToItem
        after={null}
        goTo={goTo}
        href={href}
        text={<ArrowLeftIcon size="small" />}
        id={id}
        index={index}
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

// Title
const GroupHeading = ({ text, ...props }: GroupHeadingProps) => (
  <GroupHeadingComponent {...props}>{text}</GroupHeadingComponent>
);

const Debug = props => (
  <pre
    css={{
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      fontSize: '10px',
      overflowX: 'auto',
      padding: `${gridSize / 2}px`,
    }}
  >
    {JSON.stringify(props, null, 2)}
  </pre>
);

/**
 * GROUPS
 */

// Group
const Group = ({
  customComponents,
  hasSeparator,
  heading,
  items,
  id,
}: GroupProps) =>
  items.length ? (
    <GroupComponent heading={heading} hasSeparator={hasSeparator} id={id}>
      <ItemsRenderer items={items} customComponents={customComponents} />
    </GroupComponent>
  ) : null;

// Section
const Section = ({
  customComponents,
  id,
  items,
  nestedGroupKey,
  parentId,
}: SectionProps) =>
  items.length ? (
    <SectionComponent id={id} key={nestedGroupKey} parentId={parentId}>
      {({ className }) => (
        <div className={className}>
          <ItemsRenderer items={items} customComponents={customComponents} />
        </div>
      )}
    </SectionComponent>
  ) : null;

const itemComponents = {
  ContainerHeader,
  Debug,
  GoToItem,
  Item,
  BackItem,
  Separator,
  GroupHeading,
  Switcher,
};

const groupComponents = {
  Group,
  Section,
};

const components = { ...itemComponents, ...groupComponents };

/**
 * RENDERER
 */
export const ItemsRenderer = ({
  customComponents = {},
  items,
}: ItemsRendererProps) =>
  items.map(({ type, ...props }, index) => {
    const key =
      typeof props.nestedGroupKey === 'string'
        ? props.nestedGroupKey
        : props.id;

    // If they've provided a component as the type
    if (typeof type === 'function') {
      const C = type;
      const Wrapper = navigationItemClicked(
        AnalyticsWrapper,
        C.displayName || 'inlineCustomComponent',
        {
          ...props,
          index,
          // Define onClick so that the click is recorded by analytics.
          // Override the existing version in props if it exists, so it does not
          // get executed multiple times.
          onClick: () => {},
        },
      );
      return (
        <Wrapper key={key}>
          <C
            {...props}
            // We pass our in-built components through to custom components so
            // they can wrap/render them if they want to.
            components={components}
            customComponents={customComponents}
          />
        </Wrapper>
      );
    }

    if (typeof type === 'string') {
      // If they've provided a type which matches one of our in-built group
      // components
      if (groupComponents[type]) {
        const G = groupComponents[type];
        return <G key={key} {...props} customComponents={customComponents} />;
      }

      // If they've provided a type which matches one of our in-built item
      // components.
      if (itemComponents[type]) {
        const I = itemComponents[type];
        return <I key={key} {...props} index={index} />;
      }

      // If they've provided a type which matches one of their defined custom
      // components.
      if (customComponents[type]) {
        const Wrapper = navigationItemClicked(AnalyticsWrapper, type, {
          ...props,
          index,
          // Define onClick so that the click is recorded by analytics.
          // Override the existing version in props if it exists, so it does not
          // get executed multiple times.
          onClick: () => {},
        });
        const C = customComponents[type];
        return (
          <Wrapper key={key}>
            <C
              {...props}
              // We pass our in-built components through to custom components so
              // they can wrap/render them if they want to.
              components={components}
              customComponents={customComponents}
            />
          </Wrapper>
        );
      }
    }

    return <Debug key={key} type={type} {...props} />;
  });
