import * as React from 'react';
import Item from '../src/components/Item';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import NotificationDirectIcon from '@atlaskit/icon/glyph/notification-direct';

export default () => {
  const children: JSX.Element = <span>Hello world</span>;
  return (
    <div>
      <div style={{ width: 400 }}>
        <Item
          startAdornment={<CheckboxIcon label="check" />}
          endAdornment={<NotificationDirectIcon label="Set reminder" />}
          helperText="Some helper text"
        >
          {children}
        </Item>
      </div>
      <div style={{ width: 200 }}>
        <Item
          startAdornment={<CheckboxIcon label="check" />}
          endAdornment={<NotificationDirectIcon label="Set reminder" />}
          helperText="Some helper text"
        >
          {children}
        </Item>
        <Item
          appearance="card"
          startAdornment={<CheckboxIcon label="check" />}
          endAdornment={<NotificationDirectIcon label="Set reminder" />}
          helperText="Some helper text"
        >
          {children}
        </Item>
      </div>
    </div>
  );
};
