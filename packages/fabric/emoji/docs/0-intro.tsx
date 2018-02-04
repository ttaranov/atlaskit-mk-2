import { md } from '@atlaskit/docs';

export default md`
  # Emoji

  The main purpose of the emoji package is to provide multiple components for selecting from a list of provided emojis and rendering them.

  It includes support for adding a custom set of emojis from a specified provider and uploading images as emojis to a service.

  ## Try it out

  Interact with a [live demo of the @atlaskit/emoji component](https://ak-mk-2-prod.netlify.com/mk-2/packages/fabric/emoji).

  ## Installation

  ~~~js
  npm install @atlaskit/emoji
  # or
  yarn add @atlaskit/emoji
  ~~~

  ## Using the component

  Import the component in your React app as follows:

  ~~~js
  import EmojiPicker, { EmojiResource } from '@atlaskit/emoji';
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

  Don't forget to add these polyfills to your product build if you want to target older browsers:

  * Promise ([polyfill](https://www.npmjs.com/package/es6-promise), [browser support](http://caniuse.com/#feat=promises))
  * Fetch API ([polyfill](https://www.npmjs.com/package/whatwg-fetch), [browser support](http://caniuse.com/#feat=fetch))
  * URLSearchParams API ([polyfill](https://www.npmjs.com/package/url-search-params), [browser support](http://caniuse.com/#feat=urlsearchparams))

  ### Examples

  The examples includes a set of stories for running against a live server. See 'Real Emoji Resource'.

  You can specify the URLs manually in the textarea on the story (as json configuration suitable for EmojiResource),
  or specify it when running the examples in the local-config.ts in the root of this component.

  There is an example file local-config-example.ts that can be copied.
`;
