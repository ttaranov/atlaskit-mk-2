// @flow

import React, {
  type ComponentType,
  type StatelessFunctionalComponent,
} from 'react';
import QuestionIcon from '@atlaskit/icon/glyph/question-circle';
import Badge from '@atlaskit/badge';
import Avatar from '@atlaskit/avatar';
import SignInIcon from '@atlaskit/icon/glyph/sign-in';
import Dropdown from '@atlaskit/dropdown-menu';
import type {
  GlobalNavigationProps,
  DrawerName,
} from '../components/GlobalNavigation/types';
import type { ProductConfigShape } from './types';

const isNotEmpty = obj => {
  const values = Object.values(obj);
  return !!(
    values.length && values.reduce((acc, curr) => acc || !!curr, false)
  );
};

const generateDropDown = (
  Trigger: ComponentType<{}>,
  DropdownItems: ComponentType<{}>,
) => {
  const GeneratedDropdown = ({ className }: { className: string }) => (
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
  return GeneratedDropdown;
};

const generateAvatar = profileIconUrl => {
  const GeneratedAvatar = () => (
    <Avatar
      borderColor="transparent"
      src={profileIconUrl}
      isActive={false}
      isHover={false}
      size="small"
    />
  );
  return GeneratedAvatar;
};
type OtherConfig = {
  href?: string,
  badge?: ?StatelessFunctionalComponent<*>,
};
function configFactory(onClick, tooltip, otherConfig: OtherConfig = {}) {
  const { href } = otherConfig;
  const shouldNotRenderItem = !onClick && !href;

  if (shouldNotRenderItem && (tooltip || isNotEmpty(otherConfig))) {
    /* eslint-disable no-console */
    console.warn(
      `One of the items in the Global Navigation is missing an onClick (or an href in case of the productIcon). This item will not be rendered in Global Navigation.`,
    );
    /* eslint-enable */
  }

  if (shouldNotRenderItem) return null;

  if (onClick && href) {
    /* eslint-disable no-console */
    console.warn(
      'You have provided both href and an onClick handler for one of the items. onClick will be ignored.',
    );
    /* eslint-enable */
  }

  return {
    ...(href ? { href } : { onClick }),
    ...(tooltip ? { tooltip, label: tooltip } : null),
    ...otherConfig,
  };
}

function helpConfigFactory(items, tooltip, otherConfig = {}) {
  if (!items && (tooltip || isNotEmpty(otherConfig))) {
    /* eslint-disable no-console */
    console.warn(
      'You have provided some prop(s) for help, but not helpItems. Help will not be rendered in Global Navigation',
    );
    /* eslint-enable */
  }

  if (!items) return null;

  const HelpIcon = () => <QuestionIcon secondaryColor={'inherit'} />;

  return {
    component: generateDropDown(HelpIcon, items),
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
    /* eslint-disable no-console */
    console.warn(
      'You provided some prop(s) for profile, but not profileItems or loginHref. Profile will not be rendered in Global Navigation',
    );
    /* eslint-enable */
  }

  if (shouldNotRenderProfile) return null;

  if (items && href) {
    /* eslint-disable no-console */
    console.warn(
      'You have provided both loginHref and profileItems. loginUrl prop will be ignored by Global Navigation',
    );
    /* eslint-enable */
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
  openDrawer: DrawerName => () => void,
): ProductConfigShape {
  const {
    onProductClick,
    productTooltip,
    productIcon,
    productHref,

    onCreateClick,
    createTooltip,
    createDrawerContents,

    searchTooltip,
    onSearchClick,
    searchDrawerContents,

    onStarredClick,
    starredTooltip,
    starredDrawerContents,

    onNotificationClick,
    notificationTooltip,
    notificationCount,
    notificationDrawerContents,

    appSwitcherComponent,

    helpItems,
    helpTooltip,

    profileItems,
    profileTooltip,
    loginHref,
    profileIconUrl,
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
    create: configFactory(
      onCreateClick || (createDrawerContents && openDrawer('create')),
      createTooltip,
    ),
    search: configFactory(
      onSearchClick || (searchDrawerContents && openDrawer('search')),
      searchTooltip,
    ),
    starred: configFactory(
      onStarredClick || (starredDrawerContents && openDrawer('starred')),
      starredTooltip,
    ),
    notification: configFactory(
      onNotificationClick ||
        (notificationDrawerContents && openDrawer('notification')),
      notificationTooltip,
      notificationBadge,
    ),
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
