import { md } from '@atlaskit/docs';

export default md`
  # Task/Decision

  This provides components for rendering tasks and decisions.

  ## Try it out

  Interact with a [live demo of the @atlaskit/task-decision component](https://atlaskit.atlassian.com/packages/elements/task-decision).

  ## Installation

  ~~~js
  npm install @atlaskit/task-decision
  # or
  yarn add @atlaskit/task-decision
  ~~~

  ## Using the component

  Use the component in your React app as follows:

  ~~~js
  import { DecisionList, DecisionItem } from '@atlaskit/task-decision';
  ReactDOM.render(<DecisionItem>A decision</DecisionItem>, container);
  ReactDOM.render(
    <DecisionList>
      <DecisionItem>A decision</DecisionItem>
      <DecisionItem>Another decision</DecisionItem>
    </DecisionList>,
    container,
  );
  ~~~
`;
