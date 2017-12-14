// @flow
import React, {
  Children,
  cloneElement,
  Component,
  type ChildrenArray,
  type ComponentType,
  type Element,
} from 'react';
import withDeprecationWarnings from './withDeprecationWarnings';
import Group, { GroupItem } from '../styled/ButtonGroup';
import type { ButtonProps, ButtonAppearances } from '../types';

export type ButtonGroupProps = {
  /** The appearance to apply to all buttons. */
  appearance?: ButtonAppearances,
  /** The buttons to render. */
  children: ChildrenArray<Element<ComponentType<ButtonProps>>>,
};

class ButtonGroup extends Component<ButtonGroupProps> {
  render() {
    const { appearance, children } = this.props;

    return (
      <Group>
        {/* $FlowFixMe - Children.map should be able to iterate over children, unsure why this is invalid */}
        {Children.map(children, (child, idx) => {
          if (child === null || child === false) {
            return child;
          }
          return (
            <GroupItem key={idx}>
              {appearance ? cloneElement(child, { appearance }) : child}
            </GroupItem>
          );
        })}
      </Group>
    );
  }
}

export type ButtonGroupType = ButtonGroup;

export default withDeprecationWarnings(ButtonGroup);
