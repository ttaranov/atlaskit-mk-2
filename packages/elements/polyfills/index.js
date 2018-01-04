// @flow
/*
    Note: This package is different to others where the root index file is just used as a workaround
    The polyfills package needs to expose each individual polyfill as well as a single entrance that
    pulls them all in
    e.g require('@atlaskit/polyfills/object-assign') or require('@atlaskit/polyfills')

    It deliberately does not have an atlaskit:src field as this causes issues when we alias pkg's
    locally.

    This file is also deliberately es5 as we wont be babelifying it.
*/

require('./array-prototype-includes');
require('./array-prototype-find');
require('./object-assign');
require('./string-prototype-includes');
