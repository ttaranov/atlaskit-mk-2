import * as React from 'react';
import styled from 'styled-components';
import { defaultSchema } from '@atlaskit/editor-common';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { WikiMarkupTransformer } from '../src';

const Container = styled.div`
  #source,
  #output {
    box-sizing: border-box;
    margin: 8px;
    padding: 8px;
    white-space: pre-wrap;
    width: 100%;
    &:focus {
      outline: none;
    }
  }

  #source {
    height: 80px;
  }

  #output {
    border: 1px solid;
    min-height: 480px;
  }
`;

const wikiTransformer = new WikiMarkupTransformer(defaultSchema);
const adfTransformer = new JSONTransformer();

function getADF(wiki: string) {
  const pmNode = wikiTransformer.parse(wiki);
  return adfTransformer.encode(pmNode);
}

export interface State {
  source: string;
}

class Example extends React.PureComponent<{}, State> {
  state: State = { source: '' };

  handleChange = evt => {
    this.setState({ source: evt.target.value });
  };

  render() {
    return (
      <Container>
        <textarea id="source" onChange={this.handleChange} />
        <pre id="output">
          {this.state.source
            ? JSON.stringify(getADF(this.state.source), null, 2)
            : ''}
        </pre>
      </Container>
    );
  }
}

export default () => <Example />;
