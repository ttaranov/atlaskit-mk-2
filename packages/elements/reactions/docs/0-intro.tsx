import { md } from '@atlaskit/docs';

export default md`
  # Reactions

  The main purpose of the Reactions component is to provide users the ability to react to pieces of content.

  ## Installation

  ~~~js
  npm install @atlaskit/reactions
  # or
  yarn add  @atlaskit/reactions
  ~~~

  ## Using the component

  Import the component in your React app as follows:

  ~~~js
  import { ReactionStore, ConnectedReactionsView } from '@atlaskit/reactions';
  import { EmojiResource } from '@atlaskit/emoji';

  const emojiProvider = new EmojiResource({
    providers: [
      {
        url: 'https://emoji-example/emoji/standard',
      },
      {
        url: 'https://emoji-example/emoji/site-id/site',
        securityProvider: () => ({
          headers: {
            Authorization: 'Bearer token',
          },
        }),
      },
    ],
  });

  const demoAri = 'ari:cloud:owner:demo-cloud-id:item/1';
  const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

  ReactDOM.render(
    <ReactionStore url="https://reactions-service">
      <ConnectedReactionsView
        containerAri={containerAri}
        ari={demoAri}
        emojiProvider={Promise.resolve(emojiProvider)}
      />
    </ReactionStore>,
    container,
  );
  ~~~

  ### Note:

  Don't forget to add polyfills for fetch, ES6 & ES7 to your product build if you want to target older browsers.
  We recommend the use of [babel-preset-env](https://babeljs.io/docs/plugins/preset-env/) & [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)

  Key navigation can be bound to \`selectNext\` (e.g. down arrow),
  \`selectPrevious\` (e.g. up arrow), and \`chooseCurrentSelection\`
  (e.g. enter and tab).
`;
