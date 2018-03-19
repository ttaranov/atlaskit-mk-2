// @flow

import { code, md } from '@atlaskit/docs';

export default md`
  ## 1.x - 2.x

  ### \`ref\` -> \`innerRef\`

  You will now need to use the \`innerRef\` prop to focus the field text area DOM element rather than using ref.
  This change is required because we are now wrapping FieldText with HOCs which don't work with refs
  properly.

  The ref passed to the \`innerRef\` callback function will now be the textarea DOM element itself rather than the
  FieldTextArea/FieldTextAreaStateless component instance.
  If you are referencing any other component instance properties/methods, you will need to remove this and just operate
  on the native DOM element directly.

  ${code`

    - <FieldTextArea ref={this.getFieldTextAreaRef} />
    + <FieldTextArea innerRef={this.getFieldTextAreaRef} />
  `}
`;
