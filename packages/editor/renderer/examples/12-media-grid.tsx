import * as React from 'react';
import RendererDemo from './helper/RendererDemo';

const document = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'mediaGroup',
      content: [
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: 'cff13302-e640-4380-9d08-170d6bae87c0',
            collection: 'MediaServicesSample',
            width: 651,
            height: 652,
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: 'a45b7e62-2723-4bc3-a955-bc183f09eabe',
            collection: 'MediaServicesSample',
            width: 2048,
            height: 1536,
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: '2d70d73c-8f54-4a19-ae09-4c81b8dc2330',
            collection: 'MediaServicesSample',
            width: 750,
            height: 1334,
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: 'c9b594c0-205c-4ea0-8869-9284427c0271',
            collection: 'MediaServicesSample',
            width: 1080,
            height: 1080,
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: '95bcadcd-0df8-47d0-ad7d-84d0510c87d4',
            collection: 'MediaServicesSample',
            width: 640,
            height: 448,
          },
        },
      ],
    },
  ],
};

export default function Example() {
  return (
    <RendererDemo withProviders={true} serializer="react" document={document} />
  );
}
