import * as React from 'react';
import Item from '../src/components/Item';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import { ReminderAdornment } from '../src/components/ReminderAdornment';

export default () => {
  const children: JSX.Element = <span>Hello world</span>;
  return (
    <div style={{ width: 400 }}>
      <Item
        startAdornment={<CheckboxIcon label="check" />}
        endAdornment={<ReminderAdornment />}
        helperText="Some helper text"
      >
        {children}
      </Item>
      <Item
        startAdornment={<CheckboxIcon label="check" />}
        endAdornment={<ReminderAdornment value="2018-05-31T05:00:00Z" />}
        helperText="Some helper text"
      >
        <span>
          Some huge text with a lot of words and letters and a lot other good
          stuff in it
        </span>
      </Item>
    </div>
  );
};
