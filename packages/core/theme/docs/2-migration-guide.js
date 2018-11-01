// @flow

import React from 'react';
import { code, md } from '@atlaskit/docs';
import migrateInJsImage from './assets/migrate-in-js.jpg';
import lessToCssCompileImage from './assets/less-to-css-compile.jpg';
import nestedStylesThemePackage from './assets/nested-styles-theme-package.jpg';

function Image({ src }) {
  return <img src={src} style={{ width: '100%', marginTop: '8px' }} />;
}

export default md`
## Migrate From @atlaksit/util-shared-styles

### Migrating in JS

This migration is a breeze. We can straight away remove the import of values from util-shared-styles and
use @atlaskit/theme. Since, both export values as JS variables, The only caveat is we should be using
styled-components so that styles are evaluated properly. However, If you are using Atlaskit you already
have styled-components as it is peer dependency in the packages, so why not utilize it and there should
no impact on the size of the bundle.

${<Image src={migrateInJsImage} />}

## Migrating from less

The @atlaskit/theme package does not declare styles in less file which makes it difficult to import the styles from
the package in less files. To resolve this we suggest moving away from less styles and moving to the css-in-js
solution. To make the transition to css-in-js for you we have released a new package [evaluate-inner-styles](https://www.npmjs.com/package/evaluate-inner-styles)
has been released which can help to generate static CSS from a JS object.

Steps to migrate:

1. Compile the less to CSS:
    
    a. Use → [http://lesscss.org/less-preview/](http://lesscss.org/less-preview/) to compile Less to CSS
    
    b. You might get some errors if variables are being used which are imported from util-shared-styles.
    Please declare them with string on top so that we remember to replace them, for example, → if you are using color
    @ak-color-B400 then add a new variable on top as  @ak-color-B400: \${colors.B400}.

${<Image src={lessToCssCompileImage} />}

2. Create a JS file which imports the default exported function from [evaluate-inner-styles](https://www.npmjs.com/package/evaluate-inner-styles)
which is a tagged template, you can then pass in your styles to this function. The syntax is same as offered by other css-in-js libraries like
emotion and styled-components. 

    a. Example

${code`
import evaluateInerStyles from 'evaluate-inner-styles';
export default evaluateInerStyles()\`
  div {
    color: \${colors.B400};
  }
\`
`}

3. Now instead of using the less process, you can use this small script to create styles from the above js file

${code`
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import makeDir from 'mkdirp';
const writeFile = promisify(fs.writeFile);

// Include your js stylesheet here
import styleSheet from '../src/styles';

// path the destination for the build css
const DIST = path.join(__dirname, 'dist');

async function buildCSSReset() {
  try {
    // Create the dist folder if it does not exist
    makeDir.sync(DIST);
    // Write the file
    await writeFile(path.join(DIST, 'bundle.css'), styleSheet);
  } catch (err) {
    console.error(\`Failed to build css-reset due to \${err}\`);
  }
}

// Execute the function
buildCSSReset().then(() => {
  console.log('Successfully build css-reset');
});
`}

It is common use-case where we will have multiple less files so for that we can create an index file which imports the styles from all the other files and
exports them together in logical order,

Example:

${code`
import baseStyles from './base';
import browserFixesStyles from './browser-fixes';
import resetStyles from './reset';
import tableStyles from './tables';
import utilStyles from './utils';

export default \`
\${resetStyles}
\${baseStyles}
\${tableStyles}
\${browserFixesStyles}
\${utilStyles}
\`;
`}

### Other solutions that we thought of but disregarded:

**import atlaskit/theme in less files and use variables from there ( not doing it )**

We looked for existing solutions and there was only one → [https://github.com/tompascall/js-to-styles-var-loader](https://github.com/tompascall/js-to-styles-var-loader) ,
which we cannot use because we have deeply nested styles in theme and sometimes they are a function that we need
to call.

Let's take an example of typography styles:

${<Image src={nestedStylesThemePackage} />}

***(Not digging into details but we can see that heading is a function, look at the return in themed function.)***

Creating our own tooling and maintaining it was an option but we have already seen the power of css-in-js styles and thus did not
went ahead with this solution.
`;
