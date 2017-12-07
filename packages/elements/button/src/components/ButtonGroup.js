// @flow
import React, {
  Children,
  cloneElement,
  Component,
  type ChildrenArray,
} from 'react';
import Button from './Button';
import Group, { GroupItem } from '../styled/ButtonGroup';

type Props = {
  /** The appearance to apply to all buttons. */
  appearance:
    | 'default'
    | 'link'
    | 'primary'
    | 'subtle'
    | 'subtle-link'
    | 'warning'
    | 'danger'
    | 'help',
  /** The buttons to render. */
  children: ChildrenArray<Button>,
};

export default class ButtonGroup extends Component<Props, {}> {
  render() {
    const { appearance, children } = this.props;

    return (
      <Group>
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
