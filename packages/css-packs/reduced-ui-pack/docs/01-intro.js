// @flow
import { md, code } from '@atlaskit/docs';

export default md`
## Installation

${code`
npm i @atlaskit/reduced-ui-pack;
`}

## Usage

To use the reduced UI pack, you should also use our css reset. Both should be
included in your project head like so:

${code`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Your page</title>
    <link rel="stylesheet" href="node_modules/@atlaskit/css-reset/dist/bundle.css" />
    <link rel="stylesheet" href="node_modules/@atlaskit/reduced-ui-pack/dist/bundle.css" />
  </head>
  <body>
    <p>Hello world!</p>
  </body>
</html>
`}

With this, you can access classes to add all the styling you need.

## Using Examples

The examples are written in react, however the rendered html code should be
copyable into your application, with the change of \`className\` to \`class\`.

If you want to see an example running using base html, you can see that use-case
in [codesandbox](https://codesandbox.io/s/8kj9x61yr9).
  
---

The reduced UI pack is designed to allow you to use some ADG3 styling easily
without opting in to using react. Instead, it provides a css file as its main
export, allowing you to add classes and meta-properties to html to get
styling.

## Pieces

The Reduced UI pack sets you up for styling:

* a css grid
* form elements (including buttons)
* icons
`;
