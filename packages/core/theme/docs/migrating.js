// @flow

import { code, md } from '@atlaskit/docs';

export default md`
  ## 5.x - 6.x

  The only breaking changes between these two versions are for experimental APIs.

  The only experimental API that changed here is the \`Theme\` component. Themes are no longer components, but functions that return objects.

  ### Theme shape
  
  Before, you'd pass an object to the \`values\` prop. Now, you pass a function that returns an object.

  ${code`
    import { Theme } from '@atlaskit/theme';

    - const theme = {
    -   mode: 'light'
    - }
    + const theme = parentTheme => ({
    +   ...parentTheme,
    +   mode: 'light'
    + });

    <Theme values={theme} />
  `}

  ### Component-specific theme functions

  Component themes are no longer bound, passing in the parent theme. They're now just functions, however you define them, and they can get the parent theme from the execution context of the parent function.

  ${code`
    import { Theme } from '@atlaskit/theme';

    - const theme = {
    -   badge({ appearance }, parentTheme) {
    -     return { ... };
    -   }
    - }
    + const theme = parentTheme => ({
    +   badge({ appearance }) {
    +     return { ... }
    +   }
    + });

    <Theme values={theme} />
  `}
`;
