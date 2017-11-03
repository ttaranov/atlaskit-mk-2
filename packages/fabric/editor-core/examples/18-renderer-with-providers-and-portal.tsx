import * as React from 'react';
import RendererDemo from '../example-helpers/RendererDemo';

export default function Example() {
  return (
    <RendererDemo withProviders={true} withPortal={true} serializer="react"/>
  );
}
