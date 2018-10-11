import { InjectedIntl } from 'react-intl';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { NodeType } from 'prosemirror-model';

import { Command } from '../../types';
import { ButtonAppearance } from './ui/Button';
import { DropdownOptions, RenderOptionsPropsT } from './ui/Dropdown';
import { SelectOptions, SelectOption } from './ui/Select';

export type Icon = React.ComponentType<{ label: string }>;
export type RenderOptionsProps = RenderOptionsPropsT<Command>;

export type FloatingToolbarButton<T> = {
  type: 'button';
  title: string;
  onClick: T;
  onMouseEnter?: T;
  onMouseLeave?: T;
  icon: Icon;
  selected?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  appearance?: ButtonAppearance;
};

export type FloatingToolbarSelect<T> = {
  type: 'select';
  options: SelectOptions<T>;
  hidden?: boolean;
  hideExpandIcon?: boolean;
  defaultValue?: SelectOption;
  placeholder?: string;
  onChange: (selected: SelectOption) => T;
};

export type FloatingToolbarSeparator = {
  type: 'separator';
  hidden?: boolean;
};

export type FloatingToolbarDropdown<T> = {
  type: 'dropdown';
  title: string;
  icon: Icon;
  options: DropdownOptions<T>;
  hidden?: boolean;
  hideExpandIcon?: boolean;
};

export type FloatingToolbarItem<T> =
  | FloatingToolbarButton<T>
  | FloatingToolbarDropdown<T>
  | FloatingToolbarSelect<T>
  | FloatingToolbarSeparator;

export interface FloatingToolbarConfig {
  title: string;

  /**
   * Override the DOM reference used to apply as the target for the
   * floating toolbar, if the config matches.
   *
   * By default, it will find the DOM reference of the node from the
   * head of the current selection.
   */
  getDomRef?: (view: EditorView) => HTMLElement | undefined;

  visible?: boolean;
  nodeType: NodeType | NodeType[];
  items: Array<FloatingToolbarItem<Command>>;
}

export type FloatingToolbarHandler = (
  state: EditorState,
  intl: InjectedIntl,
) => FloatingToolbarConfig | undefined;
