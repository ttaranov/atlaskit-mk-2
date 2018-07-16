// @flow
import React, {
  Children,
  cloneElement,
  Component,
  type ChildrenArray,
  type Element,
} from 'react';
import withDeprecationWarnings from './withDeprecationWarnings';
import Group, { GroupItem } from '../styled/ButtonGroup';
import type { ButtonAppearances } from '../types';

export type ButtonGroupProps = {
  /** The appearance to apply to all buttons. */
  appearance?: ButtonAppearances,
  /** The buttons to render. */
  children: ChildrenArray<Element<any> | null | void>,
};

class ButtonGroup extends Component<ButtonGroupProps> {
  render() {
    const { appearance, children } = this.props;

    return (
      <Group>
        {Children.map(children, (child, idx) => {
          if (!child) {
            return null;
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

export default withDeprecationWarnings(ButtonGroup);
