// @flow
import React, { type ComponentType } from 'react';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import Badge from '@atlaskit/badge';
import Dropdown from '@atlaskit/dropdown-menu';
import type { GlobalNavigationProps } from '../components/GlobalNavigation/types';

// Removes items with no props passed from the product.
const removeEmptyItems = items =>
  Object.keys(items)
    .filter(item => Object.keys(items[item]).length > 0)
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

export default function generateProductConfig(props: GlobalNavigationProps) {
  const product = {
    ...(props.productIcon && { icon: props.productIcon }),
    ...(props.onProductClick && { onClick: props.onProductClick }),
    ...(props.productTooltip && { tooltip: props.productTooltip }),
    ...(props.productTooltip && { label: props.productTooltip }),
  };
  const create = {
    ...(props.onCreateClick && { onClick: props.onCreateClick }),
    ...(props.createTooltip && { tooltip: props.createTooltip }),
    ...(props.createTooltip && { label: props.createTooltip }),
  };
  const search = {
    ...(props.onSearchClick && { onClick: props.onSearchClick }),
    ...(props.searchTooltip && { tooltip: props.searchTooltip }),
    ...(props.searchTooltip && { label: props.searchTooltip }),
  };
  const yourWork = {
    ...(props.onYourWorkClick && { onClick: props.onYourWorkClick }),
    ...(props.yourWorkTooltip && { tooltip: props.yourWorkTooltip }),
    ...(props.yourWorkTooltip && { label: props.yourWorkTooltip }),
  };
  const notification = {
    ...(props.onNotificationClick && { onClick: props.onNotificationClick }),
    ...(props.notificationTooltip && { tooltip: props.notificationTooltip }),
    ...(props.notificationTooltip && { label: props.notificationTooltip }),
    ...(props.notificationCount && {
      badge: () => (
        <Badge appearance="important" value={props.notificationCount} />
      ),
    }),
  };
  const people = {
    ...(props.onPeopleClick && { onClick: props.onPeopleClick }),
    ...(props.peopleTooltip && { tooltip: props.peopleTooltip }),
    ...(props.peopleTooltip && { label: props.peopleTooltip }),
  };
  const appSwitcher = {
    ...(props.onAppSwitcherClick && { onClick: props.onAppSwitcherClick }),
    ...(props.appSwitcherTooltip && { tooltip: props.appSwitcherTooltip }),
    ...(props.appSwitcherTooltip && { label: props.appSwitcherTooltip }),
    ...(props.appSwitcherItems && {
      component: () => generateDropDown(MenuIcon, props.appSwitcherItems),
    }),
  };
  const help = {
    ...(props.onHelpClick && { onClick: props.onHelpClick }),
    ...(props.helpTooltip && { tooltip: props.helpTooltip }),
    ...(props.helpTooltip && { label: props.helpTooltip }),
    ...(props.appSwitcher && {
      component: () => generateDropDown(QuestionIcon, props.appSwitcherItems),
    }),
  };
  const profile = {
    ...(props.onProfileClick && { onClick: props.onProfileClick }),
    ...(props.profileTooltip && { tooltip: props.profileTooltip }),
    ...(props.profileTooltip && { label: props.profileTooltip }),
    ...(props.profileComponent && { component: props.profileComponent }),
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
