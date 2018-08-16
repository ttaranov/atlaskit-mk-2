import * as React from 'react';
import RendererDemo from './helper/RendererDemo';

export default function Example() {
  return (
    <RendererDemo
      withProviders={true}
      appearance="full-page"
      serializer="react"
    />
  );
}
