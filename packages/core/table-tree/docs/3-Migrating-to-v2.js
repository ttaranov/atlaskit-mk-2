// @flow
import React from 'react';
import { code, Example, md } from '@atlaskit/docs';

export default md`
In the v2 release the table-tree component does not maintain a state anymore, a helper function \`toTableTreeData\`
to help you process data in case of async loading.

---

## Changes to the Props

### TableTree (Default export)

- v1 - **items**: Function that will be used to provide data for rows at a particular level in the hierarchy
- v2 - **items**: Array of data object to display in the Table Tree

### Rows:

- v1 - **items**: Function that will be used to provide data for rows at a particular level in the hierarchy
- v2 - **items**: Array of data object to display in the Table Tree

### Row:

- [New Prop] **items** - Array of child objects for a particular parent


## Upgrade with static table data ( without async loading )

In v2 API of table tree, the \`items\` prop on default export of tableTree, accepts the array of data to be presented
in table tree. Moreover, the \`items\` prop is drilled down to Rows component ( exported from package ) , therefore, we
can pass the table tree here in case we follow render props pattern.

Additionally, a new prop \`items\` is added on Row component ( exported from package ), which accepts array of children object for particular
parent item. See the example below:

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

We provide the table tree data in the \`items\` prop on the Rows component. When a row is expanded if will pass
the expanded object, parent item in this case. Thus, we get children of the expanded Row. Then we just pass in
the children in as \`items\` in Row component.

*As you may have guessed, property name children is used in example but we can name our property anything we want and
pass the same as \`items\` in Row*

## Upgrade with Async loading of table data

**Here we will discuss the recommended pattern in case of Async data loading.**

### Problem

We can use the nested table data structure where each item has a children property referencing it's children object.
However, in case of async loading we will not have children items for a particular parent item. Therefore, once we load the
the children item we need to traverse the table tree object and update the children property in the particular parent item. As
the table tree data object grows we will hit performance bottle neck in traversing table tree object.

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

*To overcome this performance bottle neck we recommend creating a flat object and to help you process data into object we provide
a helper funtion **toTableTreeData** ( we will discuss it in next section )*

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
