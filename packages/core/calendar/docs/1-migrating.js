// @flow

import { code, md } from '@atlaskit/docs';

export default md`
  ## 3.x - 4.x

  ### No more stateful / stateless components

  See the docs section for [controlled / uncontrolled props](/docs/guides/controlled-uncontrolled-props).

  Instead of using the stateless component, you now just use the stateful component and supply the props you want to be stateless.

  ${code`
    - import { CalendarStateless } from '@atlaskit/calendar';
    + import { Calendar } from '@atlaskit/calendar';

    - <CalendarStateless month={1} />
    + <Calendar month={1} />
  `}

  ### \`focused\` -> \`day\`

  ${code`
    - <CalendarStateless focused={1} />
    + <Calendar day={1} />;
  `}

  ### \`onUpdate\` -> \`onChange\`

  ${code`
    - <Calendar onUpdate={() => {}} />
    + <Calendar onChange={() => {}} />
  `}

  ### \`ref\` -> \`innerRef\`

  You will now need to use the \`innerRef\` prop to focus/navigate the calendar DOM element rather than
  using ref.
  This change is required because we will be wrapping Calendar with HOCs in the future and refs don't work with HOCs
  properly.

  ${code`

    - <Calendar ref={this.getCalendarRef} />
    + <Calendar innerRef={this.getCalendarRef} />
  `}
`;
