// @flow
import React from 'react';
import { md, Props, code } from '@atlaskit/docs';

export default md`
  # Concepts

  This is a barebones quick-search component that can render different types of search results.
  
  # Example
  ${code`import { QuickSearch, ObjectResult, ContainerResult, ResultItemGroup } from '@atlaskit/quick-search';

  // Inside a react component with proper state and stuff.. :
  render() {
    return (
      <QuickSearch
        isLoading={this.state.isLoading}
        onSearchInput={({ target }) => { this.search(target.value); }}
        value={this.state.query}
      >
        // render search results:
        <ResultItemGroup title="Issues">
          <ObjectResult name="Fix this and that" objectKey="JRA-123" /> 
          <ObjectResult name="More stuff" objectKey="JRA-124" /> 
        </ResultItemGroup>
        <ResultItemGroup title="Spaces">
          <ContainerResult name="Search and Smarts" /> 
        </ResultItemGroup>
      </QuickSearch>
    );
  }
  `}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/QuickSearch')}
    />
  )}

`;
