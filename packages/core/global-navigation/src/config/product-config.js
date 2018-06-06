// @flow
import React, { type ComponentType } from 'react';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import Badge from '@atlaskit/badge';
import Avatar from '@atlaskit/avatar';
import SignInIcon from '@atlaskit/icon/glyph/sign-in';
import Dropdown from '@atlaskit/dropdown-menu';
import type { GlobalNavigationProps } from '../components/GlobalNavigation/types';

// Remove items with no props passed from the product.
const removeEmptyItems = items =>
  Object.keys(items)
    .filter(item => items[item] && Object.keys(items[item]).length)
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

export default function generateProductConfig(props: GlobalNavigationProps) {
  // Add key only if prop is passed.
  // TODO: Make this function less verbose
  // TODO: Add warnings when improper pairs of props are passed. eg: profileItems with loginHref
  const product = props.onProductClick && {
    ...(props.productIcon ? { icon: props.productIcon } : null),
    ...(props.onProductClick ? { onClick: props.onProductClick } : null),
    ...(props.productTooltip
      ? { tooltip: props.productTooltip, label: props.productTooltip }
      : null),
  };
  const create = props.onCreateClick && {
    ...(props.onCreateClick ? { onClick: props.onCreateClick } : null),
    ...(props.createTooltip
      ? { tooltip: props.createTooltip, label: props.createTooltip }
      : null),
  };
  const search = props.onSearchClick && {
    ...(props.onSearchClick ? { onClick: props.onSearchClick } : null),
    ...(props.searchTooltip
      ? { tooltip: props.searchTooltip, label: props.searchTooltip }
      : null),
  };
  const yourWork = props.onYourWorkClick && {
    ...(props.onYourWorkClick ? { onClick: props.onYourWorkClick } : null),
    ...(props.yourWorkTooltip
      ? { tooltip: props.yourWorkTooltip, label: props.yourWorkTooltip }
      : null),
  };
  const notification = props.onNotificationClick && {
    ...(props.onNotificationClick
      ? { onClick: props.onNotificationClick }
      : null),
    ...(props.notificationTooltip
      ? { tooltip: props.notificationTooltip, label: props.notificationTooltip }
      : null),
    ...(props.notificationCount
      ? {
          badge: ((notificationCount: number) => () => (
            <Badge appearance="important" value={notificationCount} />
          ))(props.notificationCount),
        }
      : null),
  };
  const people = props.onPeopleClick && {
    ...(props.onPeopleClick ? { onClick: props.onPeopleClick } : null),
    ...(props.peopleTooltip
      ? { tooltip: props.peopleTooltip, label: props.peopleTooltip }
      : null),
  };
  const appSwitcher = props.appSwitcherComponent && {
    ...(props.appSwitcherComponent
      ? {
          component: props.appSwitcherComponent,
        }
      : null),
  };
  const help = props.helpItems && {
    ...(props.helpTooltip
      ? { tooltip: props.helpTooltip, label: props.helpTooltip }
      : null),
    ...(props.helpItems
      ? {
          component: (helpItems => generateDropDown(QuestionIcon, helpItems))(
            props.helpItems,
          ),
        }
      : null),
  };
  const profile = (props.profileItems || props.loginHref) && {
    ...(props.profileTooltip
      ? { tooltip: props.profileTooltip, label: props.profileTooltip }
      : null),
    ...(props.profileItems
      ? {
          component: (profileItems =>
            generateDropDown(
              generateAvatar(props.profileIconUrl),
              profileItems,
            ))(props.profileItems),
        }
      : { icon: SignInIcon }),
    ...(props.loginHref && !props.profileItems
      ? { href: props.loginHref }
      : null),
  };

  return removeEmptyItems({
    product,
    create,
    search,
    yourWork,
    notification,
    people,
    appSwitcher,
    help,
    profile,
  });
}
