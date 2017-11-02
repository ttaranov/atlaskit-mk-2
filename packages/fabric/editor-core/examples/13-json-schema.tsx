import * as React from 'react';
// import * as v1schema from '../json-schema/v1/full.json';

// TODO: Fix import above
const v1schema = {};

const jsonPretty = (obj: any) => JSON.stringify(obj, null, 2);

export default function Example() {
  return (
    <pre><code className="json">{jsonPretty(v1schema)}</code></pre>
  );
}
