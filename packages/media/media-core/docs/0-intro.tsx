import { md, code } from '@atlaskit/docs';

export default md`
  # MediaCore

  This package is required by other Media Components, and should not be used
  directly.

  It holds shared code between Media Components, such as:

  * models
  * providers
  * interfaces

  ## Installation

  ${code`
yarn add @atlaskit/media-core
  `}

  ## Using the component

  \`Context\` is the main object that is created with \`ContextFactory\`. It can
  be created using either \`token\` and either \`clientId\` or \`asapIssuer\`.

  ${code`
import { Context, ContextConfig, ContextFactory } from '@atlaskit/media-core';

const authProvider = ({ collectionName }) =>
  new Promise((resolve, reject) => {
    resolve({
      token: 'token-that-was-recieved-in-some-async-way',
      clientId: 'some-client-id',
      baseUrl: 'http://example.com',
      //  asapIssuer: 'asap-issuer'
    });
  });
const config: ContextConfig = {
  authProvider,
};
const context: Context = ContextFactory.create(config);
  `}
`;
