import * as React from 'react';
import { Card } from '@atlaskit/smart-card';

export default function InlineCard(props: { url?: string; data?: object }) {
  return <Card appearance="inline" url={props.url} data={props.data} />;
}
