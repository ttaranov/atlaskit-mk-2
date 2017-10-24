/* @flow */

import siteData from './site';
import type { Directory, File } from './types';

const allPackages = {
  analytics: { key: "analytics", name: "Analytics" },
  avatar: { key: "avatar", name: "Avatar" },
  badge: { key: "badge", name: "badge" },
  banner: { key: "banner", name: "Banner" },
  blanket: { key: "blanket", name: "Blanket" },
  breadcrumbs: { key: "breadcrumbs", name: "Breadcrumbs" },
  "button-group": { key: "button-group", name: "Button Group" },
  button: { key: "button", name: "Button" },
  calendar: { key: "calendar", name: "calendar" },
  checkbox: { key: "checkbox", name: "Checkbox" },
  comment: { key: "comment", name: "Comment" },
  "dropdown-menu": { key: "dropdown-menu", name: "Dropdown Menu" },
  "dynamic-table": { key: "dynamic-table", name: "Dynamic Table" },
  "field-radio-group": { key: "field-radio-group", name: "Radio Group" },
  "field-range": { key: "field-range", name: "Field Range" },
  "field-text-area": { key: "field-text-area", name: "Text Field Area" },
  "field-text": { key: "field-text", name: "Text Field" },
  flag: { key: "flag", name: "Flag" },
  icon: { key: "icon", name: "Icon" },
  "inline-dialog": { key: "inline-dialog", name: "Inline Dialog" },
  "inline-edit": { key: "inline-edit", name: "Inline Edit" },
  "inline-message": { key: "inline-message", name: "Inline Message" },
  "layer-manager": { key: "layer-manager", name: "Layer Manager" },
  logo: { key: "logo", name: "Logo" },
  lozenge: { key: "lozenge", name: "lozenge" },
  "modal-dialog": { key: "modal-dialog", name: "Modal Dialog" },
  "multi-select": { key: "multi-select", name: "Select (Multi)" },
  navigation: { key: "navigation", name: "Navigation" },
  "page-header": { key: "page-header", name: "PageHeader" },
  page: { key: "page", name: "Page" },
  pagination: { key: "pagination", name: "Pagination" },
  "progress-indicator": { key: "progress-indicator", name: "Progress Indicator" },
  "single-select": { key: "single-select", name: "Select (Single)" },
  spinner: { key: "spinner", name: "Spinner" },
  tabs: { key: "tabs", name: "Tabs" },
  "tag-group": { key: "tag-group", name: "tag-group" },
  tag: { key: "tag", name: "tag" },
  theme: { key: "theme", name: "Theme" },
  toggle: { key: "toggle", name: "Toggle" },
  tooltip: { key: "tooltip", name: "Tooltip" }
};

const getChildOfName: (Directory, string) => Directory | File | void = ({ children }, name) => children.filter(({ id }) => id === name)[0];

const part1 = getChildOfName(siteData, 'packages')
const part2 = (part1 && part1.type === 'dir') ? getChildOfName(part1, 'elements') : undefined;
const migratedComponents = (part2 && part2.type === 'dir') ? part2.children : [];
migratedComponents.forEach(({ id }) => allPackages[id].isMigrated = true);

export default allPackages;
export const packageNames = Object.keys(allPackages)
