import * as React from 'react';
import { Card } from '@atlaskit/smart-card';

export default function BlockCard(props: { url?: string; data?: object }) {
  return <Card appearance="block" url={props.url} data={props.data} />;
}
