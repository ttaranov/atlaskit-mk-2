import { md } from '@atlaskit/docs';

export default md`
  # PubSub

  This provides components for receiving events from the PubSub service

  ## Try it out

  Interact with a [live demo of the @atlaskit/pubsub component](https://atlaskit.atlassian.com/packages/elements/pubsub).

  ## Installation

  ~~~js
  npm install @atlaskit/pubsub
  # or
  yarn add @atlaskit/pubsub
  ~~~

  ## Using the component as a component developer

  ~~~js
  import { PubSubClient } from '@atlassian/pubsub';

  class Component {
    private pubSubClient: PubSubClient;

    constructor(pubSubClient: PubSubClient) {
      this.pubSubClient = pubSubClient;
      this.subscribeToPubSubEvents();
    }

    private subscribeToPubSubEvents() {
      this.pubSubClient.on('avi:jira:updated:issue', this.onIssueUpdate);
    }

    onIssueUpdate = (event: string, payload) => {

    };
  }
  ~~~

  ## Using the component as a product developer

  ~~~js
  import { default as Client } from '@atlassian/pubsub';

  const pubSubClient = new Client({
    product: 'STRIDE',
    url: 'https://api-private.atlassian.com/pubsub',
  });

  // Call join to join channels for the given context, for example for current conversations in Stride
  pubSubClient.join([
    'ari:cloud:banana:f7ebe2c0-0309-4687-b913-41d422f2110b:conversation/b17d8707-db6e-436e-95b9-102dd1986293',
  ]);

  // Call leave to leave channels (when closing a conversation for example)
  pubSubClient.leave([
    'ari:cloud:banana:f7ebe2c0-0309-4687-b913-41d422f2110b:conversation/b17d8707-db6e-436e-95b9-102dd1986293',
  ]);
  ~~~

  You should then make the pubSubClient available to components.
`;
