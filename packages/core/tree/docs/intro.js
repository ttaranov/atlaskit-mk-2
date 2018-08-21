// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`

  ${(
    <SectionMessage appearance="warning">
      <p>
        <strong>Note: @atlaskit/tree is currently a developer preview.</strong>
      </p>
      <p>
        Please experiment with and test this package but be aware that the API
        may & probably will change with future releases.
      </p>
    </SectionMessage>
  )}

  Tree component provides a generic way to visualize tree structures. It was built on top of the popular [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) 
  library in order to provide a natural way of reorganizing the nodes.
  
  ## Feature set

   - Fully customizable node rendering
   - Capability to collapse and expand subtree
   - Lazy loading of subtree
   - Reorganization of the tree by drag&drop
   - Mouse, touch and keyboard support

  ## Examples

  ${(
    <Example
      Component={require('../examples/5-pure-tree').default}
      title="Basic Drag-n-Drop Tree"
      source={require('!!raw-loader!../examples/5-pure-tree')}
    />
  )}

  ## Get started

  ### Tree data structure

  Tree is defined by a normalized data structure, where _rootId_ defines the _id_ of the root node and _items_ map contains all the nodes indexed by their _id_.
  Child relationship is defined in the parent node's _children_ field in a form of list of _id_'s.  

  **Data attribute:** Any consumer data should be defined in the _data_ attribute, e.g. title, color, selection etc.

  **State handling:** It's important to note, that this data structure will be the single source of truth. After any interaction the consumer's responsibility to execute the mutation
   on the tree. A few utils functions (_mutateTree_, _moveItemOnTree_) are provided in order to help you make those changes easily and in a performant way.

  **Performance / Side-effects:** We put some effort into optimizing rendering based on reference equality. We only re-render an Item if it's reference changed or moved on the tree.

  ${code`
type ItemId = any;

type TreeData = {
  rootId: ItemId,
  items: { [ItemId]: TreeItem },
};

type TreeItem = {|
  id: ItemId,
  children: Array<ItemId>,
  hasChildren?: boolean,
  isExpanded?: boolean,
  isChildrenLoading?: boolean,
  data?: TreeItemData,
|};
  `}

  ### Rendering

  In order to render the tree, _renderItem_ render prop must be defined on _Tree_. It will receive one object with multiple params, defined as _RenderItemParams_ .


  **Important:** _provided.innerRef_ must be bound to the highest possible DOM node in the ReactElement, even if you don't activate drag&drop.

  ${code`
type RenderItemParams = {|
  /** Item to be rendered */
  item: TreeItem,
  /** The depth of the item on the tree. 0 means root level. */
  depth: number,
  /** Function to call when a parent item needs to be expanded */
  onExpand: (itemId: ItemId) => void,
  /** Function to call when a parent item needs to be collapsed */
  onCollapse: (itemId: ItemId) => void,
  /** Couple of Props to be spread into the rendered React.Components and DOM elements */
  /** More info: https://github.com/atlassian/react-beautiful-dnd#children-function-render-props */
  provided: TreeDraggableProvided,
  /** Couple of state variables */
  /** More info: https://github.com/atlassian/react-beautiful-dnd#2-snapshot-draggablestatesnapshot */
  snapshot: DraggableStateSnapshot,
|};
  `}

  **One Example**

  ${code`
renderItem = ({
  item,
  depth,
  onExpand,
  onCollapse,
  provided,
}: RenderItemParams) => {
  return (
    <div
      key={item.id}
      style={{ paddingLeft: depth * 16 }}
    >
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <span>{getIcon(item, onExpand, onCollapse)}</span>
        <span>{item.data ? item.data.title : ''}</span>
      </div>
    </div>
  );
};
  `}

  ### Expand & Collapse

  _onExpand_ and _onCollapse are triggered when there is a need to change the state of a parent.

  **Example**

  ${code`
onExpand = (itemId: ItemId) => {
  const { tree }: State = this.state;
  this.setState({
    tree: mutateTree(tree, itemId, { isExpanded: true }),
  });
};
  `}

  ### Drag & Drop

  Drag&Drop is powered by [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd), so a couple of design principles are inherited from there. To make it work
  _provided_ from _renderItem_ must be used in a way defined earlier in the Rendering section. For custom behavior you can also act on a few additional information conveyed in
  _snapshot_ attribute.

  **Events:** _onDragStart_ and _onDragEnd_ functions will be triggered at the beginning and the end of re-ordering. They provide the necessary information as _TreePosition_ 
   to change the tree.

  **Example**

  ${code`
type TreePosition = {|
  parentId: ItemId,
  index: number,
|};

onDragEnd = (source: TreePosition, destination: ?TreePosition) => {
  const { tree } = this.state;

  if (!destination) {
    return;
  }
  const newTree = moveItemOnTree(tree, source, destination);
  this.setState({
    tree: newTree,
  });
};
  `}

  ${(
    <Props
      title="API Reference"
      props={require('!!extract-react-types-loader!../src/components/Tree/Tree')}
    />
  )}
`;
