import React from 'react';
import Badge from '@atlaskit/badge';

export default function Component() {
  return (
    <div>
      <p>with no value</p>
      <Badge />

      <p>with a negative value</p>
      <Badge value={-5} />

      <p>with a max value</p>
      <Badge max={99} value={500} />

      <p>with value <= max value</p>
      <Badge max={99} value={50} />

      <p>with value === max value</p>
      <Badge max={99} value={99} />

      <p>with appearances</p>
      <Badge appearance="primary" value={-5} />
      <Badge appearance="important" value={25} />
      <Badge appearance="added" max={99} value={3000} />
      <Badge appearance="removed" />
      <Badge appearance="default" theme="dark" />
    </div>
  );
}
