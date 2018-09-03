// @flow

import React from 'react';
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/arrow-left-circle';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right-circle';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import BacklogIcon from '@atlaskit/icon/glyph/backlog';
import BoardIcon from '@atlaskit/icon/glyph/board';
import DashboardIcon from '@atlaskit/icon/glyph/dashboard';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import ShipIcon from '@atlaskit/icon/glyph/ship';
import Spinner from '@atlaskit/spinner';
import { gridSize as gridSizeFn } from '@atlaskit/theme';

import { navigationItemClicked } from '../common/analytics';
import ContainerHeaderComponent from '../components/ContainerHeader';
import BaseItem from '../components/Item';
import SectionComponent from '../components/Section';
import SectionHeadingComponent from '../components/SectionHeading';
import Separator from '../components/Separator';
import GroupComponent from '../components/Group';
import GroupHeadingComponent from '../components/GroupHeading';
import Switcher from '../components/Switcher';
import { withNavigationUI } from '../ui-controller';
import { withNavigationViewController } from '../view-controller';

import type {
  GoToItemProps,
  GroupProps,
  GroupHeadingProps,
  ItemProps,
  ItemsRendererProps,
  SectionHeadingProps,
  SectionProps,
  WordmarkProps,
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

/**
 * ITEMS
 */

// GoToItem
const GoToItemBase = ({
  after: afterProp,
  goTo,
  navigationUIController,
  navigationViewController,
  spinnerDelay = 200,
  ...rest
}: GoToItemProps) => {
  let after;
  if (typeof afterProp === 'undefined') {
    after = ({ isActive, isHover }: *) => {
      const { incomingView } = navigationViewController.state;
      if (incomingView && incomingView.id === goTo) {
        return <Spinner delay={spinnerDelay} invertColor size="small" />;
      }
      if (isActive || isHover) {
        return (
          <ArrowRightCircleIcon
            primaryColor="currentColor"
            secondaryColor="inherit"
          />
        );
      }
      return null;
    };
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
const patchBackItemStyles = styles => ({
  ...styles,
  textWrapper: {
    ...styles.textWrapper,
    fontWeight: 500,
  },
});
const BackItem = ({ before: beforeProp, text, ...props }: ItemProps) => {
  let before = beforeProp;
  if (!before) {
    before = () => (
      <ArrowLeftCircleIcon
        primaryColor="currentColor"
        secondaryColor="inherit"
      />
    );
  }

  return (
    <div css={{ paddingBottom: gridSize * 2 }}>
      <Item
        {...props}
        after={null}
        before={before}
        text={text || 'Back'}
        styles={patchBackItemStyles}
      />
    </div>
  );
};

// Title
const GroupHeading = ({ text, ...props }: GroupHeadingProps) => (
  <GroupHeadingComponent {...props}>{text}</GroupHeadingComponent>
);

// SectionHeading
const SectionHeading = ({ text, ...props }: SectionHeadingProps) => (
  <SectionHeadingComponent {...props}>{text}</SectionHeadingComponent>
);

// ContainerHeader
const ContainerHeader = (props: *) => (
  <div css={{ paddingBottom: gridSize * 2.5 }}>
    <ContainerHeaderComponent {...props} />
  </div>
);

// Wordmark
const Wordmark = ({ wordmark: WordmarkLogo }: WordmarkProps) => (
  <div
    css={{
      lineHeight: 0,
      paddingBottom: gridSize * 3.5,
      paddingLeft: gridSize * 1.5,
      paddingTop: gridSize,
    }}
  >
    <WordmarkLogo />
  </div>
);

const Debug = (props: *) => (
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
  alwaysShowScrollHint = false,
  customComponents,
  id,
  items,
  nestedGroupKey,
  parentId,
  shouldGrow,
}: SectionProps) =>
  items.length ? (
    <SectionComponent
      alwaysShowScrollHint={alwaysShowScrollHint}
      id={id}
      key={nestedGroupKey}
      parentId={parentId}
      shouldGrow={shouldGrow}
    >
      {({ className }) => (
        <div className={className}>
          <ItemsRenderer items={items} customComponents={customComponents} />
        </div>
      )}
    </SectionComponent>
  ) : null;

const HeaderSection = ({
  customComponents,
  id,
  items,
  nestedGroupKey,
  parentId,
}: SectionProps) =>
  items.length ? (
    <SectionComponent id={id} key={nestedGroupKey} parentId={parentId}>
      {({ css }) => (
        <div
          css={{
            ...css,
            paddingTop: gridSize * 2.5,
          }}
        >
          <ItemsRenderer items={items} customComponents={customComponents} />
        </div>
      )}
    </SectionComponent>
  ) : null;

const MenuSection = ({
  alwaysShowScrollHint = false,
  customComponents,
  id,
  items,
  nestedGroupKey,
  parentId,
}: SectionProps) => (
  <SectionComponent
    alwaysShowScrollHint={alwaysShowScrollHint}
    id={id}
    key={nestedGroupKey}
    parentId={parentId}
    shouldGrow
  >
    {({ css }) => (
      <div
        css={{
          ...css,
          paddingBottom: gridSize * 1.5,
        }}
      >
        <ItemsRenderer items={items} customComponents={customComponents} />
      </div>
    )}
  </SectionComponent>
);

const itemComponents = {
  BackItem,
  ContainerHeader,
  Debug,
  GoToItem,
  GroupHeading,
  Item,
  SectionHeading,
  Separator,
  Switcher,
  Wordmark,
};

const groupComponents = {
  Group,
  HeaderSection,
  MenuSection,
  Section,
};

// Exported for testing purposes only.
export const components = { ...itemComponents, ...groupComponents };

/**
 * RENDERER
 */
const ItemsRenderer = ({ customComponents = {}, items }: ItemsRendererProps) =>
  items.map(({ type, ...props }, index) => {
    const key =
      typeof props.nestedGroupKey === 'string'
        ? props.nestedGroupKey
        : props.id;

    // If they've provided a component as the type
    if (typeof type === 'function') {
      const CustomComponent = navigationItemClicked(
        type,
        type.displayName || 'inlineCustomComponent',
      );
      return (
        <CustomComponent
          key={key}
          {...props}
          index={index}
          // We pass our in-built components through to custom components so
          // they can wrap/render them if they want to.
          components={components}
          customComponents={customComponents}
        />
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
        const CustomComponent = navigationItemClicked(
          customComponents[type],
          type,
        );
        return (
          <CustomComponent
            key={key}
            {...props}
            index={index}
            // We pass our in-built components through to custom components so
            // they can wrap/render them if they want to.
            components={components}
            customComponents={customComponents}
          />
        );
      }
    }

    return <Debug key={key} type={type} {...props} />;
  });

export default ItemsRenderer;
