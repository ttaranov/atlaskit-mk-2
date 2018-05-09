// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
The major reason for v2 release for table tree was issue:
[Table Tree doesn’t update](https://community.developer.atlassian.com/t/table-tree-doesnt-update/17043)

---

## Props Changed

### TableTree (Default export)

- New Prop: **rootItems** - Array of root objects in the table table tree

- Deprecated Prop: **items** - *deprecated* in v2

### Rows:

- New Prop: **rootItems** - Array of root objects in the table table tree

- Deprecated Prop: **items** - *deprecated*  in v2

### Row:

- New Prop: **childItems** - Array of child objects for particular parent


## Upgrade with Static Data

In the v2 API we have added \`rootItems\` prop on default export TableTree which is drilled down to Rows component ( can just pass rootItems here in case of render props ).
Moreover, there is a new Props childItems on Row which is expected to receive the children for the particular parent.

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
and thus children data can be accessed here easily ( please feel free to name the children content as per
wish, as it is configurable ).

## Update with Async Data loading

*Here we will dicuss the recommended pattern to avoiding the data processing in case of Async data loading*

### Problem

We can always use the nested data structure in case of async loading but the performance bottle neck will
be hit while trying to update the table data.

Example table data

~~~js
[
  {
    // Item 1 data,
    children: [
      {
        // child 1.1 data,
        children: [
          {
            // child 1.1.1 data,
            // ... so on
          }
        ]
      }
    ]
  }
]
~~~

In this case, *if a inner child is expanded we need to traverse the object to find the parent item and update the
child property which will be painful in case of nested object.*

### Recommendation

There is a new named export from the Table tree package - **toTableTreeData**. toTableTreeData is util function that
handles the data manipulation on table data object and creates a flat structure so that it can be consumes in Table-tree.

${(
  <Example
    Component={
      require('../examples/upgrade-guide-examples/async-data-loading').default
    }
    source={require('!!raw-loader!../examples/upgrade-guide-examples/async-data-loading')}
    title="Basic Usage: With Async loading"
    language="jsx"
  />
)}

The idea here is to maintain a two properties in state - \`rootIds\` and \`itemsById\`, the \`onExpand\`
hook is called with the parentItem to help to fetch children for that particular parent. This is where
we update the items in to flat structure and that object in \`itemsById\`

~~~js
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
~~~

**toTableTreeData** does the heavy lifting of creating the flat object identified by ids, and creates the
rootIds array to identify root items in the itemsById object. Just pass in the received children and
parentItem. Just like the Example above.
`;
