import { md, code } from '@atlaskit/docs';

export default md`
  # Fabric aggregated listeners for analytics-next API

  The main purpose of this component is to provide a high level abstraction of all Fabric listeners used with analytics-next API so
  the Products can only import this component instead of having multiple nested listeners in their code.

  The following listeners are currently implemented:

  * Fabric Editor
  * Fabric elements
  * Atlaskit (core)
  * Navigation

  Atlaskit (core) events may result in multiple events being fired for the same action if you have instrumented AK components with your own analytics. In this case we recommend temporarily excluding the atlaskit listener via the 'excludedChannels' prop until we have a fix for this on the backend.

  ## Installation

${code`
  npm install @atlaskit/analytics-listeners
  # or
  yarn add @atlaskit/analytics-listeners
`}

  ## Using the component

  Check out [live examples](https://atlaskit.atlassian.com/packages/elements/analytics-listeners/example/fabric-listener-example).
`;
