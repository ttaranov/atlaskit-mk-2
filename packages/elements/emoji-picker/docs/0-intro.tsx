import { md } from '@atlaskit/docs';

export default md`
  # Emoji Picker

  The purpose of @atlaskit/emoji-picker is to expose the AkEmojiPicker component separated from the main
  @atlaskit/emoji package.

  It includes UI for uploading images as emoji to a service and displaying this custom set from a specified provider.

  ## Try it out

  Interact with a [live demo of the @atlaskit/emoji-picker component](https://atlaskit.atlassian.com/packages/elements/emoji-picker).

  ## Installation

  ~~~js
  npm install @atlaskit/emoji-picker
  # or
  yarn add @atlaskit/emoji-picker
  ~~~

  ## Using the component

  Import the component in your React app as follows:

  ~~~js
  import EmojiPicker from '@atlaskit/emoji-picker';
  import EmojiResource from '@atlaskit/emoji';
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

  ReactDOM.render(
    <EmojiPicker
      emojiProvider={emojiProvider}
      onSelection={emoji => {
        /* do something */
      }}
    />,
    container,
  );
  ~~~

  ### Note:

  Don't forget to add polyfills for fetch, ES6 & ES7 to your product build if you want to target older browsers.
  We recommend the use of [babel-preset-env](https://babeljs.io/docs/plugins/preset-env/) & [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)

  ### Examples

  The examples includes a set of stories for running against a live server. See 'Real Emoji Resource'.

  You can specify the URLs manually in the textarea on the story (as json configuration suitable for EmojiResource),
  or specify it when running the examples in the local-config.ts in the root of this component.

  There is an example file local-config-example.ts that can be copied.
`;
