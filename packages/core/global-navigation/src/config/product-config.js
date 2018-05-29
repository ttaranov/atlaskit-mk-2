// @flow
import React from 'react';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import Badge from '@atlaskit/badge';
import Dropdown from '@atlaskit/dropdown-menu';
import type { GlobalNavigationProps } from '../components/GlobalNavigation/types';

const removeEmptyKeys = (items, obj) =>
  Object.keys(items[obj]).reduce((accumulator, curr) => {
    return accumulator || !!items[obj][curr];
  }, false);

const removeEmptyItems = items =>
  Object.keys(items)
    .filter(obj => removeEmptyKeys(items, obj))
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
    icon: props.productIcon,
    onClick: props.onProductClick,
    tooltip: props.productTooltip,
    label: props.productTooltip,
  };
  const create = {
    onClick: props.onCreateClick,
    tooltip: props.createTooltip,
    label: props.createTooltip,
  };
  const search = {
    onClick: props.onSearchClick,
    tooltip: props.searchTooltip,
    label: props.searchTooltip,
  };
  const yourWork = {
    onClick: props.onYourWorkClick,
    tooltip: props.yourWorkTooltip,
    label: props.yourWorkTooltip,
  };
  const notification = {
    onClick: props.onNotificationClick,
    tooltip: props.notificationTooltip,
    label: props.notificationTooltip,
    badge:
      props.notificationCount &&
      (() => <Badge appearance="important" value={props.notificationCount} />),
  };
  const people = {
    onClick: props.onPeopleClick,
    tooltip: props.peopleTooltip,
    label: props.peopleTooltip,
  };
  const appSwitcher = {
    onClick: props.onAppSwitcherClick,
    tooltip: props.appSwitcherTooltip,
    label: props.appSwitcherTooltip,
    component:
      !!props.appSwitcher &&
      (() => generateDropDown(MenuIcon, props.appSwitcherItems)),
  };
  const help = {
    onClick: props.onHelpClick,
    tooltip: props.helpTooltip,
    label: props.helpTooltip,
    component:
      !!props.appSwitcher &&
      (() => generateDropDown(QuestionIcon, props.appSwitcherItems)),
  };
  const profile = {
    onClick: props.onProfileClick,
    tooltip: props.profileTooltip,
    label: props.profileTooltip,
    component: props.profileComponent,
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
