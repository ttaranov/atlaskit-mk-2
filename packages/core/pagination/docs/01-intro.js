// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`

${(
  <Example
    Component={require('../examples/01-basic').default}
    title="Basic example"
    source={require('!!raw-loader!../examples/01-basic')}
  />
)}

## Installation

${code`
$ npm install @atlaskit/pagination
`}

## Usage

Pagination uses a [render props](https://reactjs.org/docs/render-props.html) pattern which helps you compose pagination.

Example API:

${code`
<Pagination>
  {( LeftNavigator, Link, RightNavigator ) => (
    <Fragement>
      <LeftNavigator />
      <Link />
      <RightNavigator />
    </Fragement>
  )}
</Pagination>
`}

## Components 

**LeftNavigator** -> This is meant to be used as left arrow in the start of pagination.

**Link** -> This is meant to be used as the button representing each Page.

**RightNavigator** -> This is meant to be used as right arrow in the end of pagination.

${(
  <Props
    props={require('!!extract-react-types-loader!../src/components/link')}
    heading="Link props"
  />
)}

${(
  <Props
    props={require('!!extract-react-types-loader!../src/components/navigators/left-navigator')}
    heading="LeftNavigator props "
  />
)}

${(
  <Props
    props={require('!!extract-react-types-loader!../src/components/navigators/right-navigator')}
    heading="RightNavigator props "
  />
)}

`;
