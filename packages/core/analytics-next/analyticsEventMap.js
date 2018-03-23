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
  /** Path to analytics test file that will be created and/or already exists */
  testPath: string,
  /** The 'component' context value that will be exposed via analytics context */
  context: string,
  /** The name of the component used in the component test file. This is also used
   * as the name of the base (unwrapped) component export in the component file path.
   * This name should be consistent, some names were manually updated so that they aligned.
   */
  component: string,
  /** A map of prop callbacks that will be instrumented with analytics.
   *  The key represents the prop callback name and the value represents the 'action'
   *  payload value that will be attached to the analytics event.
   */
  props: {
    [propName: string]: string,
  },
  /** Path to the components existing test file so that we can add mount tests to it */
  componentTestPath?: string,
  /** Signals to the codemod to not override the analytics tests in the component test
   *  file as some manual work has been done that cannot be automated.
   */
  manualComponentTestOverride?: boolean,
  /** Signals that this map entry is for test purposes and should not be part of other exports */
  test?: true,
};
const analyticsEventMap: AnalyticsEventConfig[] = [
  {
    path: 'avatar/src/components/Avatar.js',
    testPath: 'avatar/src/components/__tests__/analytics.js',
    context: 'avatar',
    component: 'Avatar',
    props: {
      onClick: 'click',
    },
    componentTestPath: 'avatar/src/components/__tests__/Avatar.js',
  },
  {
    path: 'blanket/src/Blanket.js',
    testPath: 'blanket/src/__tests__/analytics.js',
    context: 'blanket',
    component: 'Blanket',
    props: {
      onBlanketClicked: 'click',
    },
    componentTestPath: 'blanket/src/__tests__/blanket.js',
  },
  {
    path: 'breadcrumbs/src/components/BreadcrumbsStateless.js',
    testPath: 'breadcrumbs/__tests__/analytics.js',
    context: 'breadcrumbs',
    component: 'BreadcrumbsStateless',
    props: {
      onExpand: 'expand',
    },
    componentTestPath: 'breadcrumbs/__tests__/Breadcrumbs.test.js',
  },
  {
    path: 'breadcrumbs/src/components/BreadcrumbsItem.js',
    testPath: 'breadcrumbs/__tests__/analytics-item.js',
    context: 'breadcrumbs-item',
    component: 'BreadcrumbsItem',
    overwrite: 'Button',
    overwritePackage: '@atlaskit/button',
    props: {
      onClick: 'click',
    },
    componentTestPath: 'breadcrumbs/__tests__/Item.test.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'button/src/components/Button.js',
    testPath: 'button/__tests__/analytics.js',
    context: 'button',
    component: 'Button',
    props: {
      onClick: 'click',
    },
    componentTestPath: 'button/src/__tests__/testDefaultBehaviour.js',
  },
  {
    path: 'calendar/src/components/CalendarStateless.js',
    testPath: 'calendar/src/components/__tests__/analytics.js',
    context: 'calendar',
    component: 'CalendarStateless',
    props: {
      onUpdate: 'update',
    },
    componentTestPath: 'calendar/src/components/__tests__/CalendarStateless.js',
  },
  {
    path: 'checkbox/src/CheckboxStateless.js',
    testPath: 'checkbox/src/__tests__/analytics.js',
    context: 'checkbox',
    component: 'CheckboxStateless',
    wrapTarget: 'CheckboxWithTheme',
    props: {
      onChange: 'change',
    },
    componentTestPath: 'checkbox/src/__tests__/index.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'datetime-picker/src/components/DatePicker.js',
    testPath:
      'datetime-picker/src/components/__tests__/analytics-datepicker.js',
    context: 'date-picker',
    component: 'DatePicker',
    props: {
      onChange: 'change',
    },
    componentTestPath: 'datetime-picker/src/components/__tests__/DatePicker.js',
  },
  {
    path: 'datetime-picker/src/components/TimePicker.js',
    testPath:
      'datetime-picker/src/components/__tests__/analytics-timepicker.js',
    context: 'time-picker',
    component: 'TimePicker',
    props: {
      onChange: 'change',
    },
    componentTestPath: 'datetime-picker/src/components/__tests__/TimePicker.js',
  },
  {
    path: 'datetime-picker/src/components/DateTimePicker.js',
    testPath:
      'datetime-picker/src/components/__tests__/analytics-datetimepicker.js',
    context: 'date-picker',
    component: 'DateTimePicker',
    props: {
      onChange: 'change',
    },
    componentTestPath:
      'datetime-picker/src/components/__tests__/DateTimePicker.js',
  },
  {
    path: 'dropdown-menu/src/components/DropdownMenuStateless.js',
    testPath: 'dropdown-menu/__tests__/analytics.js',
    context: 'dropdown-menu',
    component: 'DropdownMenuStateless',
    overwrite: 'Droplist',
    overwritePackage: '@atlaskit/droplist',
    props: {
      onOpenChange: 'toggle',
    },
    componentTestPath: 'dropdown-menu/__tests__/DropdownMenuStateless.js',
  },
  {
    path: 'droplist/src/components/Droplist.js',
    testPath: 'droplist/src/__tests__/analytics.js',
    context: 'droplist',
    component: 'Droplist',
    props: {
      onOpenChange: 'toggle',
    },
    componentTestPath: 'droplist/src/__tests__/index.js',
  },
  {
    path: 'droplist/src/components/Item.js',
    testPath: 'droplist/src/__tests__/analytics-item.js',
    context: 'droplist-item',
    component: 'DroplistItem',
    props: {
      onActivate: 'activate',
    },
    componentTestPath: 'droplist/src/__tests__/index.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'dynamic-table/src/components/Stateless.js',
    testPath: 'dynamic-table/__tests__/analytics.js',
    context: 'dynamic-table',
    component: 'DynamicTable',
    props: {
      onSetPage: 'setPage',
      onSort: 'sort',
      onRankStart: 'rankStart',
      onRankEnd: 'rankEnd',
    },
    componentTestPath: 'dynamic-table/__tests__/Stateless.js',
  },
  {
    path: 'field-base/src/components/FieldBaseStateless.js',
    testPath: 'field-base/src/__tests__/analytics.js',
    context: 'field-base',
    component: 'FieldBaseStateless',
    props: {
      onBlur: 'blur',
      onDialogBlur: 'blur',
      onDialogClick: 'click',
      onDialogFocus: 'focus',
      onFocus: 'focus',
    },
    componentTestPath: 'field-base/src/__tests__/index.js',
  },
  {
    path: 'field-radio-group/src/Radio.js',
    testPath: 'field-radio-group/src/__tests__/analytics-radio.js',
    context: 'field-radio-group',
    component: 'AkRadio',
    wrapTarget: 'RadioWithTheme',
    props: {
      onChange: 'change',
    },
    componentTestPath: 'field-radio-group/src/__tests__/Radio.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'field-radio-group/src/RadioGroupStateless.js',
    testPath: 'field-radio-group/src/__tests__/analytics-radio-group.js',
    context: 'field-radio-group',
    component: 'FieldRadioGroupStateless',
    props: {
      onRadioChange: 'change',
    },
    componentTestPath: 'field-radio-group/src/__tests__/RadioGroup.js',
  },
  {
    path: 'field-range/src/FieldRange.js',
    testPath: 'field-range/src/__tests__/analytics.js',
    context: 'field-range',
    component: 'FieldRange',
    props: {
      onChange: 'change',
    },
    componentTestPath: 'field-range/src/__test__/fieldRangeSpec.js',
  },
  {
    path: 'field-text-area/src/FieldTextAreaStateless.js',
    testPath: 'field-text-area/src/__tests__/analytics.js',
    context: 'field-text-area',
    component: 'FieldTextAreaStateless',
    props: {
      onChange: 'change',
    },
    componentTestPath: 'field-text-area/src/__tests__/index.js',
  },
  {
    path: 'field-text/src/FieldTextStateless.js',
    testPath: 'field-text/src/__tests__/analytics.js',
    context: 'field-text',
    component: 'FieldTextStateless',
    props: {
      onBlur: 'blur',
      onChange: 'change',
      onFocus: 'focus',
      onKeyDown: 'keydown',
      onKeyPress: 'keypress',
      onKeyUp: 'keyup',
    },
    componentTestPath: 'field-text/src/__tests__/index.js',
  },
  {
    path: 'flag/src/components/Flag/index.js',
    testPath: 'flag/__tests__/analytics.js',
    context: 'flag',
    component: 'Flag',
    props: {
      onBlur: 'blur',
      onDismissed: 'dismiss',
      onFocus: 'focus',
      onMouseOut: 'mouseout',
      onMouseOver: 'mouseover',
    },
    componentTestPath: 'flag/__tests__/Flag.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'icon/src/components/Icon.js',
    testPath: 'icon/__tests__/analytics.js',
    context: 'icon',
    component: 'Icon',
    props: {
      onClick: 'click',
    },
    componentTestPath: 'icon/__tests__/IconSpec.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'inline-dialog/src/InlineDialog/index.js',
    testPath: 'inline-dialog/__tests__/analytics.js',
    context: 'inline-dialog',
    component: 'InlineDialog',
    props: {
      onContentBlur: 'blur',
      onContentClick: 'click',
      onContentFocus: 'focus',
      onClose: 'close',
    },
    componentTestPath: 'inline-dialog/__tests__/index.js',
  },
  {
    path: 'inline-edit/src/InlineEditStateless.js',
    testPath: 'inline-edit/src/__tests__/analytics.js',
    context: 'inline-edit',
    component: 'InlineEditStateless',
    props: {
      onCancel: 'cancel',
      onConfirm: 'confirm',
      onEditRequested: 'edit',
    },
    componentTestPath: 'inline-edit/src/__tests__/InlineEdit.js',
  },
  {
    path: 'input/src/SingleLineTextInput.js',
    testPath: 'input/src/__tests__/analytics.js',
    context: 'input',
    component: 'SingleLineTextInput',
    props: {
      onConfirm: 'confirm',
      onKeyDown: 'keydown',
    },
    componentTestPath: 'input/src/__tests__/index.js',
  },
  {
    path: 'item/src/components/Item.js',
    testPath: 'item/__tests__/analytics.js',
    context: 'item',
    component: 'Item',
    props: {
      onClick: 'click',
      onKeyDown: 'keydown',
      onMouseEnter: 'mouseenter',
      onMouseLeave: 'mouseleave',
    },
    componentTestPath: 'item/__tests__/Item.js',
  },
  {
    path: 'modal-dialog/src/components/Modal.js',
    testPath: 'modal-dialog/__tests__/analytics.js',
    context: 'modal-dialog',
    component: 'ModalDialog',
    props: {
      onClose: 'close',
    },
    componentTestPath: 'modal-dialog/__tests__/modalDialog.js',
  },
  {
    path: 'multi-select/src/components/Stateless.js',
    testPath: 'multi-select/__tests__/analytics.js',
    context: 'multi-select',
    component: 'MultiSelectStateless',
    props: {
      onFilterChange: 'filter',
      onNewItemCreated: 'createItem',
      onSelectedChange: 'change',
      onOpenChange: 'toggle',
    },
    componentTestPath: 'multi-select/__tests__/statelessBehaviour.js',
  },
  {
    path: 'navigation/src/components/js/Navigation.js',
    testPath: 'navigation/__tests__/analytics.js',
    context: 'navigation',
    component: 'Navigation',
    props: {
      onResize: 'resize',
      onResizeStart: 'resizeStart',
      onToggleStart: 'toggle',
      onToggleEnd: 'toggle',
    },
    componentTestPath: 'navigation/__tests__/Navigation.js',
  },
  {
    path: 'onboarding/src/components/Spotlight.js',
    testPath: 'onboarding/__tests__/analytics.js',
    context: 'spotlight',
    component: 'Spotlight',
    props: {
      targetOnClick: 'click',
    },
    componentTestPath: 'onboarding/__tests__/index.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'pagination/src/components/Pagination.js',
    testPath: 'pagination/__tests__/analytics.js',
    context: 'pagination',
    component: 'Pagination',
    props: {
      onSetPage: 'change',
    },
    componentTestPath: 'pagination/__tests__/index.js',
  },
  {
    path: 'progress-indicator/src/components/Dots.js',
    testPath: 'progress-indicator/__tests__/analytics.js',
    context: 'progress-indicator',
    component: 'ProgressDots',
    props: {
      onSelect: 'select',
    },
    componentTestPath: 'progress-indicator/__tests__/index.js',
  },
  {
    path: 'select/src/Select.js',
    testPath: 'select/src/__tests__/analytics.js',
    context: 'select',
    component: 'Select',
    props: {
      onChange: 'change',
      onKeyDown: 'keydown',
    },
    componentTestPath: 'select/src/__tests__/Select.js',
  },
  {
    path: 'single-select/src/components/StatelessSelect.js',
    testPath: 'single-select/__tests__/analytics.js',
    context: 'single-select',
    component: 'StatelessSelect',
    props: {
      onFilterChange: 'filter',
      onSelected: 'change',
      onOpenChange: 'toggle',
    },
    componentTestPath: 'single-select/__tests__/stateless.js',
  },
  {
    path: 'spinner/src/Spinner/index.js',
    testPath: 'spinner/src/Spinner/__tests__/analytics.js',
    context: 'spinner',
    component: 'Spinner',
    props: {
      onComplete: 'complete',
    },
    componentTestPath: 'spinner/src/Spinner/__tests__/index.js',
  },
  {
    path: 'table-tree/src/components/Row.js',
    testPath: 'table-tree/src/__tests__/analytics.js',
    context: 'table-tree',
    component: 'Row',
    props: {
      onExpand: 'toggle',
      onCollapse: 'toggle',
    },
    componentTestPath: 'table-tree/src/__tests__/functional.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'tabs/src/components/Tabs.js',
    testPath: 'tabs/__tests__/analytics.js',
    context: 'tabs',
    component: 'Tabs',
    props: {
      onSelect: 'change',
    },
    componentTestPath: 'tabs/__tests__/index.js',
  },
  {
    path: 'tag/src/Tag/index.js',
    testPath: 'tag/src/Tag/__tests__/analytics.js',
    context: 'tag',
    component: 'Tag',
    props: {
      onAfterRemoveAction: 'remove',
    },
    componentTestPath: 'tag/src/Tag/__tests__/index.js',
    manualComponentTestOverride: true,
  },
  {
    path: 'toggle/src/ToggleStateless.js',
    testPath: 'toggle/src/__tests__/analytics.js',
    context: 'toggle',
    component: 'ToggleStateless',
    props: {
      onBlur: 'blur',
      onChange: 'change',
      onFocus: 'focus',
    },
    componentTestPath: 'toggle/src/__tests__/index.js',
  },
  {
    path: 'tooltip/src/components/Tooltip.js',
    testPath: 'tooltip/src/components/__tests__/analytics.js',
    context: 'tooltip',
    component: 'Tooltip',
    props: {
      onMouseOver: 'mouseover',
      onMouseOut: 'mouseout',
    },
    componentTestPath: 'tooltip/src/components/__tests__/Tooltip.js',
  },
  {
    path: '__testfixtures__/addsTestsMultipleProps',
    testPath: '__testfixtures__/addsTestsMultipleProps',
    context: 'button',
    component: 'Button',
    props: {
      onClick: 'click',
      onChange: 'change',
    },
    test: true,
  },
  {
    path: '__testfixtures__',
    testPath: '__testfixtures__',
    context: 'button',
    component: 'Button',
    props: {
      onClick: 'click',
    },
    test: true,
  },
];

module.exports.analyticsPackages = analyticsEventMap
  .filter(pkg => pkg.test !== true)
  .map(config => {
    const path = config.path;

    return path.substring(0, path.indexOf('/'));
  });

module.exports.analyticsEventMap = analyticsEventMap;

module.exports.instrumentedComponents = analyticsEventMap
  .filter(pkg => pkg.test !== true)
  .reduce((acc, config) => {
    const path = config.path;
    const packageSuffix = path.substring(0, path.indexOf('/'));
    const items = [];
    Object.keys(config.props).forEach(propName => {
      items.push({
        packageName: `@atlaskit/${packageSuffix}`,
        component: config.component,
        context: { component: config.context },
        prop: propName,
        payload: { action: config.props[propName] },
      });
    });
    return acc.concat(items);
  }, []);
