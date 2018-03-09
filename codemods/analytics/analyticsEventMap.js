const analyticsEventMap = [
  {
    path: 'avatar/src/components/Avatar.js',
    testPath: 'avatar/src/components/__tests__/analytics.js',
    context: 'avatar',
    component: 'Avatar',
    props: {
      onClick: 'click'
    }
  },
  {
    path: 'blanket/src/Blanket.js',
    testPath: 'blanket/src/__tests__/analytics.js',
    context: 'blanket',
    component: 'Blanket',
    props: {
      onBlanketClicked: 'click'
    }
  },
  {
    path: 'breadcrumbs/src/components/BreadcrumbsStateless.js',
    testPath: 'breadcrumbs/__tests__/analytics.js',
    context: 'breadcrumbs',
    component: 'BreadcrumbsStateless',
    props: {
      onExpand: 'expand'
    }
  },
  {
    path: 'breadcrumbs/src/components/BreadcrumbsItem.js',
    testPath: 'breadcrumbs/__tests__/analytics-item.js',
    context: 'breadrumbs-item',
    component: 'BreadcrumbsItem',
    // TODO: Implement this functionality
    overwrite: 'Button',
    props: {
      onClick: 'click'
    }
  },
  {
    path: 'button/src/components/Button.js',
    testPath: 'button/__tests__/analytics.js',
    context: 'button',
    component: 'Button',
    props: {
      onClick: 'click'
    }
  },
  {
    path: 'calendar/src/components/CalendarStateless.js',
    testPath: 'calendar/src/components/__tests__/analytics.js',
    context: 'calendar',
    component: 'CalendarStateless',
    props: {
      onUpdate: 'update'
    }
  },
  {
    path: 'checkbox/src/CheckboxStateless.js',
    testPath: 'checkbox/src/__tests__/analytics.js',
    context: 'checkbox',
    component: 'CheckboxStateless',
    wrapTarget: 'CheckboxWithTheme',
    props: {
      onChange: 'change'
    }
  },
  {
    path: 'datetime-picker/src/components/DatePicker.js',
    testPath: 'datetime-picker/src/components/__tests__/analytics-datepicker.js',
    context: 'date-picker',
    component: 'DatePicker',
    props: {
      onChange: 'change'
    }
  },
  {
    path: 'datetime-picker/src/components/TimePicker.js',
    testPath: 'datetime-picker/src/components/__tests__/analytics-timepicker.js',
    context: 'time-picker',
    component: 'TimePicker',
    props: {
      onChange: 'change'
    }
  },
  {
    path: 'datetime-picker/src/components/DateTimePicker.js',
    testPath: 'datetime-picker/src/components/__tests__/analytics-datetimepicker.js',
    context: 'date-picker',
    component: 'DateTimePicker',
    props: {
      onChange: 'change'
    }
  },
  {
    path: 'dropdown-menu/src/components/DropdownMenuStateless.js',
    testPath: 'dropdown-menu/__tests__/analytics.js',
    context: 'dropdown-menu',
    component: 'DropdownMenuStateless',
    overwrite: 'Droplist',
    props: {
      onOpenChange: 'toggle'
    }
  },
  {
    path: 'droplist/src/components/Droplist.js',
    testPath: 'droplist/src/__tests__/analytics.js',
    context: 'droplist',
    component: 'Droplist',
    props: {
      onOpenChange: 'toggle'
    }
  },
  {
    path: 'droplist/src/components/Item.js',
    testPath: 'droplist/src/__tests__/analytics-item.js',
    context: 'droplist-item',
    component: 'DroplistItem',
    overwrite: 'Item',
    props: {
      onActivate: 'activate'
    }
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
    }
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
    }
  },
  {
    path: 'field-radio-group/src/Radio.js',
    testPath: 'field-radio-group/src/__tests__/analytics-radio.js',
    context: 'field-radio-group',
    component: 'AkRadio',
    wrapTarget: 'RadioWithTheme',
    props: {
      onChange: 'change'
    }
  },
  {
    path: 'field-radio-group/src/RadioGroupStateless.js',
    testPath: 'field-radio-group/src/__tests__/analytics-radio-group.js',
    context: 'field-radio-group',
    component: 'FieldRadioGroupStateless',
    props: {
      onRadioChange: 'change'
    }
  },
  {
    path: 'field-range/src/FieldRange.js',
    testPath: 'field-range/src/__test__/fieldRangeSpec.js',
    context: 'field-range',
    component: 'FieldRange',
    overwrite: 'Input',
    props: {
      onChange: 'change'
    }
  },
  {
    path: 'field-text-area/src/FieldTextAreaStateless.js',
    testPath: 'field-text-area/src/__tests__/analytics.js',
    context: 'field-text-area',
    component: 'FieldTextAreaStateless',
    props: {
      onChange: 'change'
    }
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
    }
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
    }
  },
  {
    path: 'icon/src/components/Icon.js',
    testPath: 'icon/__tests__/analytics.js',
    context: 'icon',
    component: 'Icon',
    props: {
      onClick: 'click'
    }
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
    }
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
    }
  },
  {
    path: 'input/src/SingleLineTextInput.js',
    testPath: 'input/src/__tests__/analytics.js',
    context: 'input',
    component: 'SingleLineTextInput',
    props: {
      onConfirm: 'confirm',
      onKeyDown: 'keydown',
    }
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
    }
  },
  {
    path: 'modal-dialog/src/components/Modal.js',
    testPath: 'modal-dialog/__tests__/analytics.js',
    context: 'modal-dialog',
    component: 'ModalDialog',
    props: {
      onClose: 'close',
    }
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
    }
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
    }
  },
  {
    path: 'onboarding/src/components/Spotlight.js',
    testPath: 'onboarding/__tests__/analytics.js',
    context: 'spotlight',
    component: 'Spotlight',
    props: {
      targetOnClick: 'click'
    }
  },
  {
    path: 'pagination/src/components/Stateless.js',
    testPath: 'pagination/__tests__/analytics.js',
    context: 'pagination',
    component: 'PaginationStateless',
    props: {
      onSetPage: 'change'
    }
  },
  {
    path: 'progress-indicator/src/components/Dots.js',
    testPath: 'progress-indicator/__tests__/analytics.js',
    context: 'progress-indicator',
    component: 'ProgressDots',
    props: {
      onSelect: 'select'
    }
  },
  {
    path: 'select/src/Select.js',
    testPath: 'select/src/__tests__/analytics.js',
    context: 'select',
    component: 'Select',
    props: {
      onChange: 'change',
      onKeyDown: 'keydown',
    }
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
    }
  },
  {
    path: 'spinner/src/Spinner/index.js',
    testPath: 'spinner/src/Spinner/__tests__/analytics.js',
    context: 'spinner',
    component: 'Spinner',
    props: {
      onComplete: 'complete',
    }
  },
  {
    path: 'table-tree/src/components/Row.js',
    testPath: 'table-tree/src/__tests__/analytics.js',
    context: 'table-tree',
    component: 'Row',
    props: {
      onExpand: 'toggle',
      onCollapse: 'toggle',
    }
  },
  {
    path: 'tabs/src/components/Tabs.js',
    testPath: 'tabs/__tests__/analytics.js',
    context: 'tabs',
    component: 'Tabs',
    props: {
      onSelect: 'change',
    }
  },
  {
    path: 'tag/src/Tag/index.js',
    testPath: 'tag/src/Tag/__tests__/analytics.js',
    context: 'tag',
    component: 'Tag',
    props: {
      onAfterRemoveAction: 'remove',
    }
  },
  {
    path: 'toggle/src/ToggleStateless.js',
    testPath: 'toggle/src/__tests__/analytics.js',
    context: 'toggle',
    component: 'ToggleStateless',
    overwrite: 'Input',
    props: {
      onBlur: 'blur',
      onChange: 'change',
      onFocus: 'focus',
    }
  },
  {
    path: 'tooltip/src/components/Tooltip.js',
    testPath: 'tooltip/src/components/__tests__/analytics.js',
    context: 'tooltip',
    component: 'Tooltip',
    props: {
      onMouseOver: 'mouseover',
      onMouseOut: 'mouseout',
    }
  },
  {
    path: '__testfixtures__/addsTestsMultipleProps',
    testPath: '__testfixtures__/addsTestsMultipleProps',
    context: 'button',
    component: 'Button',
    props: {
      onClick: 'click',
      onChange: 'change',
    }
  },
  {
    path: '__testfixtures__',
    testPath: '__testfixtures__',
    context: 'button',
    component: 'Button',
    props: {
      onClick: 'click'
    }
  }, 
];

module.exports.analyticsPackages = analyticsEventMap
  .map(config => {
    const path = config.path;

    return path.substring(0, path.indexOf('/'));
  })
  .filter(pkg => pkg.length > 0 && pkg !== '__testfixtures__');

module.exports.analyticsEventMap = analyticsEventMap;