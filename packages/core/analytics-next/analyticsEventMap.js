// @flow
/**
 * This map was originally used to configure the analytics codemod to run over
 * each component.
 * It is now also used as the source of truth for the instrumented components section of
 * the docs.
 * If analytics has been manually for a component and you do not wish for it to be
 * codemodded, add an `ignore: true` prop to it.
 */

type AnalyticsEventConfig = {
  /** Path to component being wrapped with analytics */
  path: string,
  /** The 'component' context value that will be exposed via analytics context */
  context: string,
  /** Any components that derive from the base component that will therefore have analytics
   * as well. E.g. any stateful version of a stateless component.
   */
  derivatives?: string[],
  /** The name of the component being wrapped. */
  component: string,
  /** A map of prop callbacks that will be instrumented with analytics.
   *  The key represents the prop callback name and the value represents the 'action'
   *  payload value that will be attached to the analytics event.
   */
  props: {
    [propName: string]: string | string[],
  },
};
const analyticsEventMap: AnalyticsEventConfig[] = [
  {
    path: 'avatar/src/components/Avatar.js',
    context: 'avatar',
    component: 'Avatar',
    props: {
      onClick: 'click',
    },
  },
  {
    path: 'blanket/src/Blanket.js',
    context: 'blanket',
    component: 'Blanket',
    props: {
      onBlanketClicked: 'click',
    },
  },
  {
    path: 'breadcrumbs/src/components/BreadcrumbsStateless.js',
    context: 'breadcrumbs',
    component: 'BreadcrumbsStateless',
    derivatives: ['Breadcrumbs'],
    props: {
      onExpand: 'expand',
    },
  },
  {
    path: 'breadcrumbs/src/components/BreadcrumbsItem.js',
    context: 'breadcrumbs-item',
    component: 'BreadcrumbsItem',
    overwrite: 'Button',
    overwritePackage: '@atlaskit/button',
    props: {
      onClick: 'click',
    },
  },
  {
    path: 'button/src/components/Button.js',
    context: 'button',
    component: 'Button',
    props: {
      onClick: 'click',
    },
  },
  {
    path: 'calendar/src/components/Calendar.js',
    context: 'calendar',
    component: 'Calendar',
    props: {
      onChange: 'change',
      onSelect: 'select',
    },
  },
  {
    path: 'checkbox/src/CheckboxStateless.js',
    context: 'checkbox',
    component: 'CheckboxStateless',
    derivatives: ['Checkbox'],
    props: {
      onChange: 'change',
    },
  },
  {
    path: 'datetime-picker/src/components/DatePicker.js',
    context: 'date-picker',
    component: 'DatePicker',
    props: {
      onChange: 'change',
    },
  },
  {
    path: 'datetime-picker/src/components/TimePicker.js',
    context: 'time-picker',
    component: 'TimePicker',
    props: {
      onChange: 'change',
    },
  },
  {
    path: 'datetime-picker/src/components/DateTimePicker.js',
    context: 'date-picker',
    component: 'DateTimePicker',
    props: {
      onChange: 'change',
    },
  },
  {
    path: 'dropdown-menu/src/components/DropdownMenuStateless.js',
    context: 'dropdown-menu',
    component: 'DropdownMenuStateless',
    derivatives: ['DropdownMenu'],
    overwrite: 'Droplist',
    overwritePackage: '@atlaskit/droplist',
    props: {
      onOpenChange: 'toggle',
    },
  },
  {
    path: 'droplist/src/components/Droplist.js',
    context: 'droplist',
    component: 'Droplist',
    props: {
      onOpenChange: 'toggle',
    },
  },
  {
    path: 'droplist/src/components/Item.js',
    context: 'droplist-item',
    component: 'DroplistItem',
    props: {
      onActivate: 'activate',
    },
  },
  {
    path: 'dynamic-table/src/components/Stateless.js',
    context: 'dynamic-table',
    component: 'DynamicTable',
    props: {
      onSetPage: 'setPage',
      onSort: 'sort',
      onRankStart: 'rankStart',
      onRankEnd: 'rankEnd',
    },
  },
  {
    path: 'field-base/src/components/FieldBaseStateless.js',
    context: 'field-base',
    component: 'FieldBaseStateless',
    derivatives: ['FieldBase'],
    props: {
      onBlur: 'blur',
      onDialogBlur: 'blur',
      onDialogClick: 'click',
      onDialogFocus: 'focus',
      onFocus: 'focus',
    },
  },
  {
    path: 'field-radio-group/src/Radio.js',
    context: 'field-radio-group',
    component: 'AkRadio',
    props: {
      onChange: 'change',
    },
  },
  {
    path: 'field-radio-group/src/RadioGroupStateless.js',
    context: 'field-radio-group',
    component: 'AkFieldRadioGroup',
    derivatives: ['RadioGroup'],
    props: {
      onRadioChange: 'change',
    },
  },
  {
    path: 'field-range/src/FieldRange.js',
    context: 'field-range',
    component: 'FieldRange',
    props: {
      onChange: 'change',
    },
  },
  {
    path: 'field-text/src/FieldTextStateless.js',
    context: 'field-text',
    component: 'FieldTextStateless',
    derivatives: ['FieldText'],
    props: {
      onBlur: 'blur',
      onChange: 'change',
      onFocus: 'focus',
      onKeyDown: 'keydown',
      onKeyPress: 'keypress',
      onKeyUp: 'keyup',
    },
  },
  {
    path: 'field-text-area/src/FieldTextAreaStateless.js',
    context: 'field-text-area',
    component: 'FieldTextAreaStateless',
    derivatives: ['FieldTextArea'],
    props: {
      onChange: 'change',
    },
  },
  {
    path: 'flag/src/components/Flag/index.js',
    context: 'flag',
    component: 'Flag',
    props: {
      onBlur: 'blur',
      onDismissed: 'dismiss',
      onFocus: 'focus',
      onMouseOut: 'mouseout',
      onMouseOver: 'mouseover',
    },
  },
  {
    path: 'icon/src/components/Icon.js',
    context: 'icon',
    component: 'Icon',
    props: {
      onClick: 'click',
    },
  },
  {
    path: 'inline-dialog/src/InlineDialog/index.js',
    context: 'inline-dialog',
    component: 'InlineDialog',
    props: {
      onContentBlur: 'blur',
      onContentClick: 'click',
      onContentFocus: 'focus',
      onClose: 'close',
    },
  },
  {
    path: 'inline-edit/src/InlineEditStateless.js',
    context: 'inline-edit',
    component: 'InlineEditStateless',
    derivatives: ['InlineEdit'],
    props: {
      onCancel: 'cancel',
      onConfirm: 'confirm',
      onEditRequested: 'edit',
    },
  },
  {
    path: 'input/src/SingleLineTextInput.js',
    context: 'input',
    component: 'SingleLineTextInput',
    props: {
      onConfirm: 'confirm',
      onKeyDown: 'keydown',
    },
  },
  {
    path: 'item/src/components/Item.js',
    context: 'item',
    component: 'Item',
    props: {
      onClick: 'click',
      onKeyDown: 'keydown',
      onMouseEnter: 'mouseenter',
      onMouseLeave: 'mouseleave',
    },
  },
  {
    path: 'modal-dialog/src/components/Modal.js',
    context: 'modal-dialog',
    component: 'ModalDialog',
    props: {
      onClose: 'close',
    },
  },
  {
    path: 'multi-select/src/components/Stateless.js',
    context: 'multi-select',
    component: 'MultiSelectStateless',
    props: {
      onFilterChange: 'filter',
      onNewItemCreated: 'createItem',
      onSelected: 'selected',
      onRemoved: 'removed',
      onOpenChange: 'toggle',
    },
  },

  {
    path: 'multi-select/src/components/Stateful.js',
    context: 'multi-select',
    component: 'MultiSelect',
    props: {
      onFilterChange: 'filter',
      onNewItemCreated: 'createItem',
      onSelectedChange: ['selected', 'removed'],
      onOpenChange: 'toggle',
    },
  },
  {
    path: 'navigation/src/components/js/Navigation.js',
    context: 'navigation',
    component: 'Navigation',
    props: {
      onResize: 'resize',
      onResizeStart: 'resizeStart',
      onToggleStart: 'toggle',
      onToggleEnd: 'toggle',
    },
  },
  {
    path: 'onboarding/src/components/Spotlight.js',
    context: 'spotlight',
    component: 'Spotlight',
    props: {
      targetOnClick: 'click',
    },
  },
  {
    path: 'pagination/src/components/Pagination.js',
    context: 'pagination',
    component: 'Pagination',
    props: {
      onChange: 'change',
    },
  },
  {
    path: 'progress-indicator/src/components/Dots.js',
    context: 'progress-indicator',
    component: 'ProgressDots',
    props: {
      onSelect: 'select',
    },
  },
  {
    path: 'select/src/Select.js',
    context: 'select',
    component: 'Select',
    props: {
      onChange: 'change',
      onKeyDown: 'keydown',
    },
  },
  {
    path: 'single-select/src/components/StatelessSelect.js',
    context: 'single-select',
    component: 'StatelessSelect',
    derivatives: ['SingleSelect'],
    props: {
      onFilterChange: 'filter',
      onSelected: 'change',
      onOpenChange: 'toggle',
    },
  },
  {
    path: 'spinner/src/Spinner/index.js',
    context: 'spinner',
    component: 'Spinner',
    props: {
      onComplete: 'complete',
    },
  },
  {
    path: 'table-tree/src/components/Row.js',
    context: 'table-tree',
    component: 'Row',
    props: {
      onExpand: 'toggle',
      onCollapse: 'toggle',
    },
  },
  {
    path: 'tabs/src/components/Tabs.js',
    context: 'tabs',
    component: 'Tabs',
    props: {
      onSelect: 'change',
    },
  },
  {
    path: 'tag/src/Tag/index.js',
    context: 'tag',
    component: 'Tag',
    props: {
      onAfterRemoveAction: 'remove',
    },
  },
  {
    path: 'toggle/src/ToggleStateless.js',
    context: 'toggle',
    component: 'ToggleStateless',
    derivatives: ['Toggle'],
    props: {
      onBlur: 'blur',
      onChange: 'change',
      onFocus: 'focus',
    },
  },
  {
    path: 'tooltip/src/components/Tooltip.js',
    context: 'tooltip',
    component: 'Tooltip',
    props: {
      onMouseOver: 'mouseover',
      onMouseOut: 'mouseout',
    },
  },
];

module.exports.analyticsPackages = analyticsEventMap.map(config => {
  const path = config.path;

  return path.substring(0, path.indexOf('/'));
});

module.exports.analyticsEventMap = analyticsEventMap;

module.exports.instrumentedComponents = analyticsEventMap.reduce(
  (acc, config) => {
    const path = config.path;
    const packageSuffix = path.substring(0, path.indexOf('/'));
    const items = [];
    Object.keys(config.props).forEach(propName => {
      const components = config.derivatives
        ? [config.component].concat(config.derivatives).join(', ')
        : config.component;
      items.push({
        packageName: `@atlaskit/${packageSuffix}`,
        component: components,
        context: { component: config.context },
        prop: propName,
        payload: { action: config.props[propName] },
      });
    });
    return acc.concat(items);
  },
  [],
);
