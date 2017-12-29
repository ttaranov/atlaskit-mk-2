// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  For use cases that need more fine-grained control, the \`TableTree\` allows for templating based on the 
  render prop pattern and several exported subcomponents.
  
  The render prop is called whenever a tree row needs to be displayed.
  It receives row's data and should return a React
  component — a row of data cells.
  
  ## Examples
  ${(
    <Example
      Component={require('../examples/render-prop-async').default}
      source={require('!!raw-loader!../examples/render-prop-async')}
      title="Basic"
      language="javascript"
    />
  )}
  
  The \`Headers\' component can be skipped if it's not necessary:
  
  ${(
    <Example
      Component={require('../examples/render-prop-no-headers').default}
      source={require('!!raw-loader!../examples/render-prop-no-headers')}
      title="No headers"
      language="javascript"
    />
  )}
  
  ## Subcomponents
  ### Headers
  A row holding the \`Header\` components. Can be skipped if no headers are needed.
  
  ### Header
  A header cell for the given column.
    
  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Header')}
    />
  )}
  
  ### Rows
  A placeholder that is automatically expanded into nested rows. The data for
  the rows is supplied by the \`items\` property.
  
  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Rows')}
    />
  )}
  
  ### Row
  A row holding the data cells.
  
  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Row')}
    />
  )}
  
  ### Cell
  A cell that contains data.
  
  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Cell')}
    />
  )}
  
`;
