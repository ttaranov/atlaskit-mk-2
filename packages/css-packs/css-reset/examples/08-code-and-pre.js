// @flow
import React from 'react';

export default () => (
  <div>
    <h2>Preformatted text using {`<pre>`}</h2>
    <pre>{`  Item    | Qty
-------------------
Apples  |   5
Oranges |  10
Grapes  |  99`}</pre>
    <h2>Code blocks with {`<pre> and <code>`}</h2>
    <pre>
      <code>
        {`<div class="foo">
<h1>Example markup snippet</h1>
<p>Sona si Latine loqueris. Si <b>Hoc Legere</b> Scis Nimium Eruditionis Habes. Sentio aliquos togatos contra me conspirare.</p>
</div>`}
      </code>
    </pre>
    <h2>Inline {`<code>`}</h2>
    <p>
      Simply paste <code>{`body { font-weight: bold; }`}</code> into your file.
    </p>
  </div>
);
