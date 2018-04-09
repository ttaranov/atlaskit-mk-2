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

export type FieldComponentsType = Array<PackageType>;

export type PackageType = {
  name: string,
  version: string,
  components: Array<ComponentType>,
};

export type ComponentType = {
  name: string,
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
    name: '@atlaskit/calendar',
    components: [
      {
        name: 'Calendar',
        support: PARTIAL,
        changeFunc: 'onUpdate',
        changeValue: '',
      },
    ],
  },
  {
    version: '',
    name: '@atlaskit/checkbox',
    components: [
      {
        name: 'Checkbox',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
      {
        name: 'CheckboxStateless',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
      {
        name: 'CheckboxGroup',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
    ],
  },
  {
    version: '',
    name: '@atlaskit/datetime-picker',
    components: [
      {
        name: 'DatePicker',
        support: PARTIAL,
        changeFunc: 'onUpdate',
        changeValue: '',
      },
      {
        name: 'DateTimePicker',
        support: PARTIAL,
        changeFunc: 'onUpdate',
        changeValue: '',
      },
      {
        name: 'TimePicker',
        support: PARTIAL,
        changeFunc: 'onUpdate',
        changeValue: '',
      },
    ],
  },
  {
    version: '',
    name: '@atlaskit/dropdown-menu',
    components: [
      {
        name: 'DropdownMenu',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
      {
        name: 'DropdownMenuStateless',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
    ],
  },
  {
    version: '',
    name: '@atlaskit/droplist',
    components: [
      {
        name: 'DropList',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
      {
        name: 'DroplistGroup',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
      {
        name: 'Item',
        support: NONE,
        changeFunc: 'onChange',
        changeValue: '',
      },
    ],
  },
  {
    version: '',
    name: '@atlaskit/field-radio-group',
    components: [
      {
        name: 'RadioGroup',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
      {
        name: 'AkFieldRadioGroup',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
      {
        name: 'AkRadio',
        support: NONE,
        changeFunc: 'onChange',
        changeValue: '',
      },
    ],
  },
  {
    version: '',
    name: '@atlaskit/field-range',
    components: [
      {
        name: 'FieldRange',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
    ],
  },
  {
    version: '',
    name: '@atlaskit/field-text	',
    components: [
      {
        name: 'FieldText',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
      {
        name: 'FieldTextStateless',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
    ],
  },
  {
    version: '',
    name: '@atlaskit/field-text-area',
    components: [
      {
        name: 'FieldTextArea',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
      {
        name: 'FieldTextAreaStateless',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
    ],
  },
  {
    version: '',
    name: '@atlaskit/inline-edit',
    components: [
      {
        name: 'InlineEdit',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
      {
        name: 'InlineEditStateless',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
    ],
  },
  {
    version: '',
    name: '@atlaskit/multi-select',
    components: [
      {
        name: 'MultiSelect',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
      {
        name: 'MultiSelectStateless',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
    ],
  },
  {
    version: '',
    name: '@atlaskit/select',
    components: [
      {
        name: 'Select',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
    ],
  },
  {
    version: '',
    name: '@atlaskit/single-select',
    components: [
      {
        name: 'AkSingleSelect',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
      {
        name: 'SelectStateless',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
    ],
  },
  {
    version: '',
    name: '@atlaskit/toggle',
    components: [
      {
        name: 'Toggle',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
      {
        name: 'ToggleStateless',
        support: PARTIAL,
        changeFunc: 'onChange',
        changeValue: '',
      },
    ],
  },
];
