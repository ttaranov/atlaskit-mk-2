import { EditorState } from 'prosemirror-state';
import { Command } from '../../types';
import { ButtonAppearance } from './ui/Button';
import { DropdownOptions, RenderOptionsPropsT } from './ui/Dropdown';

export type Icon = React.ComponentType<{ label: string }>;
export type RenderOptionsProps = RenderOptionsPropsT<Command>;

export type FloatingToolbarItem<T> =
  | {
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
    }
  | {
      type: 'dropdown';
      title: string;
      icon: Icon;
      options: DropdownOptions<T>;
      hidden?: boolean;
      hideExpandIcon?: boolean;
    }
  | { type: 'separator'; hidden?: boolean };

export interface FloatingToolbarConfig {
  title: string;
  target: HTMLElement;
  items: Array<FloatingToolbarItem<Command>>;
}

export type FloatingToolbarHandler = (
  state: EditorState,
) => FloatingToolbarConfig | undefined;
