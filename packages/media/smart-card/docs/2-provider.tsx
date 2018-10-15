import { md } from '@atlaskit/docs';

export default md`
# Intro

The Provider component has one purpose: provide a custom client to cards:

~~~
const customFetch = (url: string): Promise<ResolveResponse> | null => {
  if (checkIfWeCanHandle(url)) {
    return Promise.resolve(customResponse);
  }
  return null;
}
...
<Provider client={new Client({ customFetch })}>
  ...
  <Card appearance="block" url={specialCaseUrl} />
  ...
</Provider>
...
~~~

As such, we can customise the way the URL will be handeled.
`;
