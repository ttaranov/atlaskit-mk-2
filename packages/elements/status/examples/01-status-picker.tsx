import * as React from 'react';
import { StatusPicker } from '../src';

export default () => (
  <div style={{ width: '225px' }}>
    <StatusPicker
      text={'In progress'}
      selectedColor={'green'}
      onTextChanged={t => console.log(`Text changed: ${t}`)}
      onColorClick={c => console.log(`Color clicked: ${c}`)}
      onEnter={() => console.log(`Enter pressed`)}
    />
  </div>
);
