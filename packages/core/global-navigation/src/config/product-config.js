// @flow
import React, { type ComponentType } from 'react';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import Badge from '@atlaskit/badge';
import Avatar from '@atlaskit/avatar';
import SignInIcon from '@atlaskit/icon/glyph/sign-in';
import Dropdown from '@atlaskit/dropdown-menu';
import type { GlobalNavigationProps } from '../components/GlobalNavigation/types';

const isEmpty = obj => (obj ? !!obj : !!Object.keys(obj).length);

// Remove empty and falsey (including 0) keys from an object
const compact = (items: GlobalNavigationProps) =>
  Object.keys(items)
    .filter(item => isEmpty(item))
    .reduce((acc, curr) => {
      acc[curr] = items[curr];
      return acc;
    }, {});

const generateDropDown = (
  Trigger: ComponentType<*>,
  DropdownItems: ComponentType<*>,
) => ({ className }: { className: string }) => (
  <Dropdown
    trigger={
      <span className={className}>
        <Trigger />
      </span>
    }
    position="right bottom"
    boundariesElement="window"
  >
    <DropdownItems />
  </Dropdown>
);

const generateAvatar = profileIconUrl => () => (
  <Avatar
    borderColor="transparent"
    src={profileIconUrl}
    isActive={false}
    isHover={false}
    size="small"
  />
);

function configFactory(onClick, tooltip, otherConfig = {}) {
  if (!onClick && (tooltip || !isEmpty(otherConfig))) {
    console.warn(
      `One of the items in the Global Navigation is missing an onClick handler. This item will not be rendered in Global Navigation.`,
    );
  }

  if (!onClick) return null;

  return {
    onClick,
    ...(tooltip ? { tooltip, label: tooltip } : null),
    ...compact(otherConfig),
  };
}

function helpConfigFactory(items, tooltip, otherConfig = {}) {
  if (!items && (tooltip || !isEmpty(otherConfig))) {
    console.warn(
      'You have provided some prop(s) for help, but not helpItems. Help will not be rendered in Global Navigation',
    );
  }

  if (!items) return null;

  return {
    component: generateDropDown(QuestionIcon, items),
    ...(tooltip ? { tooltip, label: tooltip } : null),
    ...compact(otherConfig),
  };
}

function profileConfigFactory(
  items,
  tooltip,
  href,
  profileIconUrl,
  otherConfig = {},
) {
  if (!items && !href && (tooltip || !isEmpty(otherConfig))) {
    console.warn(
      'You provided some prop(s) for profile, but not profileItems or loginHref. Profile will not be rendered in Global Navigation',
    );
  }

  if (!items && !href) return null;

  if (items && href) {
    console.warn(
      'You have provided both loginHref and profileItems. loginUrl prop will be ignored by Global Navigation',
    );
  }

  const profileComponent = items
    ? { component: generateDropDown(generateAvatar(profileIconUrl), items) }
    : { icon: SignInIcon, href };

  return {
    ...profileComponent,
    ...(tooltip ? { tooltip, label: tooltip } : null),
    ...compact(otherConfig),
  };
}

export default function generateProductConfig(props: GlobalNavigationProps) {
  const {
    onProductClick,
    productTooltip,
    productIcon,
    onCreateClick,
    createTooltip,
    onSearchClick,
    searchTooltip,
    onYourWorkClick,
    yourWorkTooltip,
    onNotificationClick,
    notificationTooltip,
    notificationCount,
    onPeopleClick,
    peopleTooltip,
    helpItems,
    helpTooltip,
    profileItems,
    profileTooltip,
    loginHref,
    profileIconUrl,
    appSwitcherComponent,
  } = props;

  const notificationBadge = {
    badge: notificationCount
      ? () => <Badge appearance="important" value={notificationCount} />
      : null,
  };

  return compact({
    product: configFactory(onProductClick, productTooltip, {
      icon: productIcon,
    }),
    create: configFactory(onCreateClick, createTooltip),
    search: configFactory(onSearchClick, searchTooltip),
    yourWork: configFactory(onYourWorkClick, yourWorkTooltip),
    notification: configFactory(
      onNotificationClick,
      notificationTooltip,
      notificationBadge,
    ),
    people: configFactory(onPeopleClick, peopleTooltip),
    help: helpConfigFactory(helpItems, helpTooltip),
    profile: profileConfigFactory(
      profileItems,
      profileTooltip,
      loginHref,
      profileIconUrl,
    ),
    appSwitcher: appSwitcherComponent
      ? { component: appSwitcherComponent }
      : null,
  });
}
