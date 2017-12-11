// @flow
import React, {
  Children,
  cloneElement,
  Component,
  type ChildrenArray,
  type Element,
} from 'react';
import Button from './Button';
import Group, { GroupItem } from '../styled/ButtonGroup';

type Props = {
  /** The appearance to apply to all buttons. */
  appearance?:
    | 'default'
    | 'link'
    | 'primary'
    | 'subtle'
    | 'subtle-link'
    | 'warning'
    | 'danger'
    | 'help',
  /** The buttons to render. */
  children: ChildrenArray<Element<typeof Button>>,
};

export default class ButtonGroup extends Component<Props, {}> {
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
