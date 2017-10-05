// @flow

import React from 'react';
import styled from 'styled-components';
import Loadable from 'react-loadable';
import Code from '../components/Code';
import Loading from '../components/Loading';
import Page from '../components/Page';
import type { Directory } from '../types';
import * as fs from '../utils/fs';

const Body = styled.div`
  margin: 20px 0;
`;

type Props = {
  examples: Directory,
  exampleId: string,
};

export default function Example(props: Props) {
  const filePath = `examples/${props.exampleId}`;
  const found = fs.findNormalized(props.examples, filePath);

  const Content = Loadable.Map({
    loader: {
      Component: () => found && found.exports(),
      code: () => found && found.contents(),
    },
    loading: Loading,
    render(map) {
      console.log(map);
      // if (map) {
      //
      //
      //   // return React.createElement(mod.default);
      //
      //   // {this.state.codeText ? (
      //   //   <div>
      //   //     {CodeNode && <CodeNode />}
      //   //     <Code>{this.state.codeText}</Code>
      //   //   </div>
      //   // ) : (
      //   //   <Loading />
      //   // )}
      // } else {
      //   return <FourOhFour/>;
      // }
    }
  });

  return (
    <Page>
      <h1>{props.exampleId}</h1>
      <Body>
        <Content/>
      </Body>
    </Page>
  );
};




// export default class Example extends React.Component<ExampleProps, ExampleState> {
//   props: ExampleProps;
//   state: ExampleState = {};
//
//   componentDidMount() {
//     const { group, name, example } = this.props.match.params;
//
//     // getData(join(group, name), example).then(data => {
//     //   this.setState({
//     //     codeText: data.codeText,
//     //     CodeNode: data.CodeNode,
//     //   });
//     // });
//   }
//
//   render() {
//     const CodeNode: any = this.state.CodeNode;
//     return (
//       <Page>
//         <h1>{formatName(this.props.match.params.example)}</h1>
//         <Body>
//           {this.state.codeText ? (
//             <div>
//               {CodeNode && <CodeNode />}
//               <Code>{this.state.codeText}</Code>
//             </div>
//           ) : (
//             <Loading />
//           )}
//         </Body>
//       </Page>
//     );
//   }
// }
