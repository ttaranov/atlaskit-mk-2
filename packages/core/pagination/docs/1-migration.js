//@flow
import React from 'react';
import { md } from '@atlaskit/docs';

export default md`
## v7 to v8

This major release is due to the design updates in the pagination component.

**API for Pagination component is the same as in v7**

### Spacing on top is required

As per spec Pagination component should have a spacing of 24px on top. So, you might need to add \`margin-bottom: 24px\` to the preceding element.

We did not include this spacing this spacing in component as consumers may already have added this spacing in previous version. Also, it will break if the preceeding element as margin-bottom styles.
`;
