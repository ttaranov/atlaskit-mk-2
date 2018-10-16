import * as React from 'react';
import UserPickerItem from './UserPickerItem';

export const UserMultiValueLabel = props => (
  <UserPickerItem user={props.data.user} />
);
