// @flow

import * as React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  ## 3.x - 4.x

  ### No more stateful / stateless components

  See the docs section for [controlled / uncontrolled props](/docs/guides/controlled-uncontrolled-props).

  Instead of using the stateless component, you now just use the stateful component and supply the props you want to be stateless.

  ~~~js
  - import { CalendarStateless } from '@atlaskit/calendar';
  + import { Calendar } from '@atlaskit/calendar';

  - <CalendarStateless month={1} />
  - <Calendar month={1} />
  ~~~
`;
