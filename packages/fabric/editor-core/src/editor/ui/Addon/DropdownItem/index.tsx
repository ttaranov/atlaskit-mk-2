import * as React from 'react';
import { DropdownItem } from './styles';
import { AddonProps } from '../types';

// tslint:disable-next-line:variable-name
const DropdownItemWrapper = (props: AddonProps) => (
  <DropdownItem
    // tslint:disable-next-line:jsx-no-lambda
    onClick={() => props.onClick && props.onClick({
      actionOnClick: props.actionOnClick,
      renderOnClick: props.renderOnClick
    })}
  >
    <span>{props.icon}</span>
    {props.children}
  </DropdownItem>
);

export default DropdownItemWrapper;
