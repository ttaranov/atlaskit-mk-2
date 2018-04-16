import { md } from '@atlaskit/docs';

export default md`
  # Architecture

  ### Items pre-loading

  * media-core will expose something like:

  ~~~
  context.preload([{
    id: 'id1',
    dimensions: {}
  }, {id: 'id2'}])
  ~~~
`;
