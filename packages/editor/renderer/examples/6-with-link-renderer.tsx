import * as React from 'react';
import RendererDemo from './helper/RendererDemo';

export default function Example() {
  return (
    <RendererDemo
      withProviders={true}
      withLinkRenderer={true}
      serializer="react"
    />
  );
}
