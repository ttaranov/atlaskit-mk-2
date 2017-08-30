// @flow
import * as React from 'react';
import { render } from 'react-dom';

import '@atlaskit/css-reset';

import types from '!!extract-react-types-loader!../../components/badge/src/components/Badge';

console.log(types);

function renderType(type) {
  if (type.kind === 'number') {
    return <span>number</span>
  } else {
    throw new Error('wat: ' + type.kind);
  }
}

function Types(props) {
  return (
    <div>
      {props.types.classes.map(klass => {
        return (
          <div>
            {klass.props.map(prop => {
              console.log(prop.value);
              return <div>{prop.key}: {renderType(prop.value)}</div>;
            })}
          </div>
        );
      })}
    </div>
  )
}

function App() {
  return <Types types={types}/>;
}

render(<App />, document.getElementById('app'));
