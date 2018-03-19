// @flow

import { code, md } from '@atlaskit/docs';

export default md`
  ## 4.x - 5.x

  ### \`ref\` -> \`innerRef\`

  You will now need to use the \`innerRef\` prop to focus the field text DOM element rather than using ref.
  This change is required because we are now wrapping FieldText with HOCs which don't work with refs
  properly.

  The ref passed to the \`innerRef\` callback function will now be the input DOM element itself rather than the
  FieldText/FieldTextStateless component instance.
  If you are referencing any other component instance properties/methods, you will need to remove this and just operate
  on the native DOM element directly.

  ${code`

    - <FieldText ref={this.getFieldTextRef} />
    + <FieldText innerRef={this.getFieldTextRef} />
  `}
`;
