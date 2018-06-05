// @flow
import React, { type ComponentType } from 'react';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import Badge from '@atlaskit/badge';
import Avatar from '@atlaskit/avatar';
import Dropdown from '@atlaskit/dropdown-menu';
import type { GlobalNavigationProps } from '../components/GlobalNavigation/types';

// Remove items with no props passed from the product.
const removeEmptyItems = items =>
  Object.keys(items)
    .filter(item => Object.keys(items[item]).length)
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
  const product = {
    ...(props.productIcon ? { icon: props.productIcon } : null),
    ...(props.onProductClick ? { onClick: props.onProductClick } : null),
    ...(props.productTooltip ? { tooltip: props.productTooltip } : null),
    ...(props.productTooltip ? { label: props.productTooltip } : null),
  };
  const create = {
    ...(props.onCreateClick ? { onClick: props.onCreateClick } : null),
    ...(props.createTooltip ? { tooltip: props.createTooltip } : null),
    ...(props.createTooltip ? { label: props.createTooltip } : null),
  };
  const search = {
    ...(props.onSearchClick ? { onClick: props.onSearchClick } : null),
    ...(props.searchTooltip ? { tooltip: props.searchTooltip } : null),
    ...(props.searchTooltip ? { label: props.searchTooltip } : null),
  };
  const yourWork = {
    ...(props.onYourWorkClick ? { onClick: props.onYourWorkClick } : null),
    ...(props.yourWorkTooltip ? { tooltip: props.yourWorkTooltip } : null),
    ...(props.yourWorkTooltip ? { label: props.yourWorkTooltip } : null),
  };
  const notification = {
    ...(props.onNotificationClick
      ? { onClick: props.onNotificationClick }
      : null),
    ...(props.notificationTooltip
      ? { tooltip: props.notificationTooltip }
      : null),
    ...(props.notificationTooltip
      ? { label: props.notificationTooltip }
      : null),
    ...(props.notificationCount
      ? {
          badge: ((notificationCount: number) => () => (
            <Badge appearance="important" value={notificationCount} />
          ))(props.notificationCount),
        }
      : null),
  };
  const people = {
    ...(props.onPeopleClick ? { onClick: props.onPeopleClick } : null),
    ...(props.peopleTooltip ? { tooltip: props.peopleTooltip } : null),
    ...(props.peopleTooltip ? { label: props.peopleTooltip } : null),
  };
  const appSwitcher = {
    ...(props.onAppSwitcherClick
      ? { onClick: props.onAppSwitcherClick }
      : null),
    ...(props.appSwitcherTooltip
      ? { tooltip: props.appSwitcherTooltip }
      : null),
    ...(props.appSwitcherTooltip ? { label: props.appSwitcherTooltip } : null),
    ...(props.appSwitcherComponent
      ? {
          component: props.appSwitcherComponent,
        }
      : null),
  };
  const help = {
    ...(props.onHelpClick ? { onClick: props.onHelpClick } : null),
    ...(props.helpTooltip ? { tooltip: props.helpTooltip } : null),
    ...(props.helpTooltip ? { label: props.helpTooltip } : null),
    ...(props.helpItems
      ? {
          component: (helpItems => generateDropDown(QuestionIcon, helpItems))(
            props.helpItems,
          ),
        }
      : null),
  };
  const profile = {
    ...(props.onProfileClick ? { onClick: props.onProfileClick } : null),
    ...(props.profileTooltip ? { tooltip: props.profileTooltip } : null),
    ...(props.profileTooltip ? { label: props.profileTooltip } : null),
    ...(props.profileItems
      ? {
          component: (profileItems =>
            generateDropDown(
              generateAvatar(props.profileIconUrl),
              profileItems,
            ))(props.profileItems),
        }
      : null),
  };

  const obj = removeEmptyItems({
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
  console.log(obj);
  return obj;
}
