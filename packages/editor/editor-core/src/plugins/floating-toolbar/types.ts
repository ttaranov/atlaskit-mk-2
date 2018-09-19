import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { NodeType } from 'prosemirror-model';

import { Command } from '../../types';
import { ButtonAppearance } from './ui/Button';
import { DropdownOptions, RenderOptionsPropsT } from './ui/Dropdown';
import { SelectOptions, SelectOption } from './ui/Select';

export type Icon = React.ComponentType<{ label: string }>;
export type RenderOptionsProps = RenderOptionsPropsT<Command>;

export type SelectToolbarItem<T> = {
  type: 'select';
  title: string;
  options: SelectOptions<T>;
  hidden?: boolean;
  hideExpandIcon?: boolean;
  defaultValue?: SelectOption;
  placeholder?: string;
  onChange: (selected: SelectOption) => T;
};

export type FloatingToolbarItem<T> =
  | {
      type: 'button';
      title: string;
      onClick?: T;
      onMouseEnter?: T;
      onMouseLeave?: T;
      icon: Icon;
      selected?: boolean;
      disabled?: boolean;
      spacing?: 'default' | 'compact';
      hidden?: boolean;
      appearance?: ButtonAppearance;
    }
  | {
      type: 'dropdown';
      title: string;
      icon: Icon;
      options: DropdownOptions<T>;
      hidden?: boolean;
      hideExpandIcon?: boolean;
    }
  | SelectToolbarItem<T>
  // {
  //     type: 'select';
  //     title: string;
  //     options: SelectOptions<T>;
  //     hidden?: boolean;
  //     hideExpandIcon?: boolean;
  //     defaultValue?: SelectOption;
  //     placeholder?: string;
  //     onChange: (selected: SelectOption) => T;
  //   }
  | { type: 'separator'; hidden?: boolean };

export interface FloatingToolbarConfig {
  title: string;
  getDomRef: (view: EditorView) => HTMLElement | undefined;
  nodeType: NodeType | NodeType[];
  items: Array<FloatingToolbarItem<Command>>;
}

export type FloatingToolbarHandler = (
  state: EditorState,
) => FloatingToolbarConfig | undefined;
