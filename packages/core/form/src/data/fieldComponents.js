// @flow
/**
 * Right now...
 * This provides a map of field components and makes it possible to deal with AK components
 * that are across different generations. We use it to flag any unsupported field components and also to make tools
 * like Form Builder possible.
 *
 * In the future...
 * We can assume that AK field components will provide a consistent API and likely expose any form api meta data themselves.
 * At that point this file would only be useful for tools like the Form Builder & examples and there will probably be options
 * to generate this dynamically
 */

/* eslint-disable no-unused-vars */

export type FieldComponentsType = Array<ComponentType>;

export type PackageType = {
  component: string,
  version: string,
  components: Array<ComponentType>,
};

export type ComponentType = {
  version: string,
  package: string,
  component: string,
  type?: string,
  changeFunc: string,
  /** The path to the value within the "onChange" params. If empty it is asumed
   * that ony a single value is passed.
   */
  changeValue: string,
  /** Supported level. 0: none, 1: partial 2:full */
  support: number,
  supportInfo?: string,
};

const NONE: number = 0;
const PARTIAL: number = 1;
const FULL: number = 2;

export const fieldComponents: FieldComponentsType = [
  {
    version: '',
    package: '@atlaskit/calendar',
    component: 'Calendar',
    support: PARTIAL,
    changeFunc: 'onUpdate',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/checkbox',
    component: 'Checkbox',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
    supportInfo: 'Label displayed by field component',
  },
  {
    version: '',
    package: '@atlaskit/checkbox',
    component: 'CheckboxStateless',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
    supportInfo: 'Label displayed by field component',
  },
  {
    version: '',
    package: '@atlaskit/checkbox',
    component: 'CheckboxGroup',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
    supportInfo: 'Label displayed by field component',
  },
  {
    version: '',
    package: '@atlaskit/datetime-picker',
    component: 'DatePicker',
    support: PARTIAL,
    changeFunc: 'onUpdate',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/datetime-picker',
    component: 'DateTimePicker',
    support: PARTIAL,
    changeFunc: 'onUpdate',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/datetime-picker',
    component: 'TimePicker',
    support: PARTIAL,
    changeFunc: 'onUpdate',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/dropdown-menu',
    component: 'DropdownMenu',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/dropdown-menu',
    component: 'DropdownMenuStateless',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/droplist',
    component: 'DropList',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/droplist',
    component: 'DroplistGroup',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/droplist',
    component: 'Item',
    support: NONE,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/field-radio-group',
    component: 'RadioGroup',
    support: NONE,
    changeFunc: 'onChange',
    changeValue: '',
    supportInfo:
      'This component has been deprecated. Use components from @atlaskit/radio instead',
  },
  {
    version: '',
    package: '@atlaskit/field-radio-group',
    component: 'AkFieldRadioGroup',
    support: NONE,
    changeFunc: 'onChange',
    changeValue: '',
    supportInfo:
      'This component has been deprecated. Use components from @atlaskit/radio instead',
  },
  {
    version: '',
    package: '@atlaskit/field-radio-group',
    component: 'AkRadio',
    support: NONE,
    changeFunc: 'onChange',
    changeValue: '',
    supportInfo:
      'This component has been deprecated. Use components from @atlaskit/radio instead',
  },
  {
    version: '',
    package: '@atlaskit/field-range',
    component: 'FieldRange',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/field-text',
    component: 'FieldText',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/field-text',
    component: 'FieldTextStateless',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/field-text-area',
    component: 'FieldTextArea',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/field-text-area',
    component: 'FieldTextAreaStateless',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/inline-edit',
    component: 'InlineEdit',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/inline-edit',
    component: 'InlineEditStateless',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/multi-select',
    component: 'MultiSelect',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/multi-select',
    component: 'MultiSelectStateless',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/radio',
    component: 'Radio',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/select',
    component: 'Select',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/single-select',
    component: 'AkSingleSelect',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/single-select',
    component: 'SelectStateless',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/toggle',
    component: 'Toggle',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
  {
    version: '',
    package: '@atlaskit/toggle',
    component: 'ToggleStateless',
    support: PARTIAL,
    changeFunc: 'onChange',
    changeValue: '',
  },
];
