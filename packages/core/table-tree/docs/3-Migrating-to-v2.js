// @flow
import React from 'react';
import { code, Example, md } from '@atlaskit/docs';

export default md`
In the v2 release the table-tree component does not maintain a state anymore, a helper function \`toTableTreeData\`
to help you process data in case of async loading.

---

## Changes to the Props

### TableTree (Default export)

- **items** - Array of data object to display in the Table Tree

### Rows:

- **items** - Array of data object to display in the Table Tree

### Row:

- **items** - Array of child objects for a particular parent


## With Static Data

In the v2 API the \`items\` prop on default export TableTree which is drilled down to Rows component ( can just pass \`items\` here in case of render props ).
Moreover, there is a new prop \`items\` on Row which expects to receive the children for the particular parent.

${(
  <Example
    Component={
      require('../examples/upgrade-guide-examples/static-data').default
    }
    source={require('!!raw-loader!../examples/upgrade-guide-examples/static-data')}
    title="Basic Usage: With Static Data"
    language="jsx"
  />
)}

### Explanation:

Most important trick is done in the render prop of Rows component. Rows follows a render prop pattern
where the react function component passed in as render prop will receive the parent object as argument
and thus children data can be accessed here easily ( please feel free to name the children property as per
wish, as it is configurable ).

## With Async loading of data

*Here we will discuss the recommended pattern to avoid data processing in case of Async data loading.*

### Problem

We can always use the nested data structure in case of async loading but the performance bottle neck will
be hit while trying to update the table data.

Example table data

${code`
[
  {
    // Item 1 data,
    children: [
      {
        // child 1.1 data,
        children: [
          {
            // child 1.1.1 data,
            // ... and so on
          }
        ]
      }
    ]
  }
]
`}

In this case, *if a inner child is expanded we need to traverse the object to find the parent item and update the
child property which will be painful in case of nested object.*

### Recommendation

There is a new named export from the Table tree package - **toTableTreeData**. \`toTableTreeData\` is util function that
handles the data manipulation on table data object and creates a flat structure so that it can be easily consumed in Table-tree.

${(
  <Example
    Component={
      require('../examples/upgrade-guide-examples/async-data-loading').default
    }
    source={require('!!raw-loader!../examples/upgrade-guide-examples/async-data-loading')}
    title="Advance Usage: With Async loading"
    language="jsx"
  />
)}

The idea here is to maintain two properties in state \`rootIds\` and \`itemsById\`. The \`onExpand\`
hook is called with the parentItem to help to fetch children for that particular parent. This is where
we update the items in to flat structure and that object in \`itemsById\`

${code`
itemsById: {
  'id1': {
    // Item with id1 as keyId,
    childIds: [
      'id2',
      // all the other child ids
    ]
  },
  'id2': {
    // Child of item 'id1'
    childIds: [
      // child ids if there are any children
    ]
  }
}
`}

**toTableTreeData** does the heavy lifting of creating the flat object identified by ids, and creates the
rootIds array to identify root items in the itemsById object. To do this, pass in the received children and parentItem,
like in the example above.
`;
