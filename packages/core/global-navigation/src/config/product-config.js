// @flow
import React, { type ComponentType } from 'react';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import Badge from '@atlaskit/badge';
import Avatar from '@atlaskit/avatar';
import SignInIcon from '@atlaskit/icon/glyph/sign-in';
import Dropdown from '@atlaskit/dropdown-menu';
import type { GlobalNavigationProps } from '../components/GlobalNavigation/types';
import type { ProductConfigShape } from './types';

const isNotEmpty = obj => {
  const values = Object.values(obj);
  return !!(
    values.length && values.reduce((acc, curr) => acc || !!curr, false)
  );
};

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
  const { href } = otherConfig;
  const shouldNotRenderItem = !onClick && !href;

  if (shouldNotRenderItem && (tooltip || isNotEmpty(otherConfig))) {
    /* eslint-disable-next-line no-console */
    console.warn(
      `One of the items in the Global Navigation is missing an onClick (or an href in case of the productIcon). This item will not be rendered in Global Navigation.`,
    );
  }

  if (shouldNotRenderItem) return null;

  if (onClick && href) {
    /* eslint-disable-next-line no-console */
    console.warn(
      'You have provided both href and an onClick handler for one of the items. onClick will be ignored.',
    );
  }

  return {
    ...(href ? { href } : { onClick }),
    ...(tooltip ? { tooltip, label: tooltip } : null),
    ...otherConfig,
  };
}

function helpConfigFactory(items, tooltip, otherConfig = {}) {
  if (!items && (tooltip || isNotEmpty(otherConfig))) {
    /* eslint-disable-next-line no-console */
    console.warn(
      'You have provided some prop(s) for help, but not helpItems. Help will not be rendered in Global Navigation',
    );
  }

  if (!items) return null;

  return {
    component: generateDropDown(QuestionIcon, items),
    ...(tooltip ? { tooltip, label: tooltip } : null),
    ...otherConfig,
  };
}

function profileConfigFactory(
  items,
  tooltip,
  href,
  profileIconUrl,
  otherConfig = {},
) {
  const shouldNotRenderProfile = !items && !href;
  if (shouldNotRenderProfile && (tooltip || isNotEmpty(otherConfig))) {
    /* eslint-disable-next-line no-console */
    console.warn(
      'You provided some prop(s) for profile, but not profileItems or loginHref. Profile will not be rendered in Global Navigation',
    );
  }

  if (shouldNotRenderProfile) return null;

  if (items && href) {
    /* eslint-disable-next-line no-console */
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
    ...otherConfig,
  };
}

export default function generateProductConfig(
  props: GlobalNavigationProps,
): ProductConfigShape {
  const {
    onProductClick,
    productTooltip,
    productIcon,
    productHref,
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

  return {
    product: configFactory(onProductClick, productTooltip, {
      icon: productIcon,
      href: productHref,
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
  };
}
