import * as React from 'react';

class Modal extends React.Component {}

const isConfluence = () =>
  document.location.pathname && document.location.pathname.startsWith('/wiki');
const promise: Promise<React.Component> = isConfluence()
  ? Promise.resolve(Modal)
  : import('@atlaskit/modal-dialog').then(Modal => Modal.default);

export default promise;
