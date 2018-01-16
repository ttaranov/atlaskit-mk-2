/// <reference types="node" />
import * as fullSchemaJSON from '../../../editor-common/json-schema/v1/full.json';
import { defaultSchema as pmSchema } from '@atlaskit/editor-common';
import * as RefParser from 'json-schema-ref-parser';
import { transformSchema } from '../adf-schema-generator/utils';
import {
  isAnyOfNode,
  SchemaNode,
  isAllOfNode,
  isTypedNode,
  ObjectNode,
} from '../adf-schema-generator/types';
import { NodeType } from 'prosemirror-model';

export const pathToText = (pmHistory: NodeType[]) =>
  pmHistory.map(item => item.name).join(' | ');

const findAllCompatibleNodeTypes = (nodeType: NodeType) =>
  Object.keys(pmSchema.nodes)
    .map(k => pmSchema.nodes[k])
    .filter(t => nodeType.contentMatch.matchType(t));

export const getSchemaNode = async () => {
  const refParser = new RefParser();
  return refParser.dereference(transformSchema(fullSchemaJSON), {
    parse: { yaml: false, text: false, binary: false },
  }) as Promise<ObjectNode>;
};

export const getPossiblePaths = (
  startingNodeType: NodeType = pmSchema.topNodeType,
) => {
  const paths: NodeType[][] = [];
  const __possiblePaths = (history: NodeType[], nodeType: NodeType) => {
    // If we find a cycle, we're done!
    if (history.indexOf(nodeType) !== -1) {
      return paths.push(history);
    }

    // Find what nodes can be placed inside the current NodeType
    const possible = findAllCompatibleNodeTypes(nodeType);
    if (possible.length) {
      return possible.map(nt => __possiblePaths([...history, nodeType], nt));
    }
    paths.push([...history, nodeType]);
  };
  __possiblePaths([], startingNodeType);
  return paths;
};

export const checkPathInADF = (
  path: NodeType[],
  adfNode: SchemaNode,
): boolean => {
  const [next, ...rest] = path;
  if (isAnyOfNode(adfNode)) {
    return adfNode.anyOf.map(node => checkPathInADF(path, node)).some(i => i);
  } else if (isAllOfNode(adfNode)) {
    const allOfBaseNode = adfNode.allOf
      .filter(
        i =>
          isTypedNode(i) &&
          i.type === 'object' &&
          i.properties.type &&
          i.properties.type.enum,
      )
      .pop();
    return checkPathInADF(path, allOfBaseNode as SchemaNode);
  } else if (isTypedNode(adfNode)) {
    if (adfNode.type === 'object') {
      const adfNodeTypeName = adfNode.properties.type.enum[0];
      if (next.name === adfNodeTypeName) {
        return rest.length
          ? checkPathInADF(rest, adfNode.properties.content)
          : true;
      }
      return false;
    } else if (adfNode.type === 'array') {
      return checkPathInADF(path, adfNode.items);
    }
  }
  throw new Error('Should not be triggered here!');
};

// const schemaHistoryToText = (history: SchemaNode[]) =>
//   history
//     .map(item => {
//       if (isAnyOfNode(item)) {
//         return 'anyOf';
//       } else if (isAllOfNode(item)) {
//         return 'allOf';
//       } else if (isTypedNode(item)) {
//         return item.type === 'object'
//           ? `${item.properties.type.enum[0]}`
//           : `${item.type}`;
//       } else {
//         return 'unknown';
//       }
//     })
//     .join(' | ');

// export default async () => {
//   const refParser = new RefParser();

//   const adfSchema = (await refParser.dereference(
//     transformSchema(fullSchemaJSON),
//     {
//       parse: { yaml: false, text: false, binary: false },
//     },
//   )) as ObjectNode;

//   /**
//    * Validate that no node-type structure violates the ADF
//    *   - From top-to-bottom, traverse the PMSchema checking that the current chain of node-types
//    *     can similarly be traced in the ADF.
//    *   - When we see a chain loop (return to a known recursive path), terminate and try other permutations
//    *   - We are trying to find a chain of children that is invalid in the ADF
//    */

//   const findAllCompatibleNodeTypes = (node: NodeType) =>
//     Object.keys(pmSchema.nodes)
//       .map(k => pmSchema.nodes[k])
//       .filter(t => node.contentMatch.matchType(t));

//   const findIfPossibleInSchema = (
//     schemaHistory: SchemaNode[],
//     pmHistory: NodeType[],
//   ) => {
//     const head = schemaHistory[schemaHistory.length - 1];
//     const possibleNodeType = pmHistory[pmHistory.length - 1];

//     if (schemaHistory.indexOf(head) !== schemaHistory.length - 1) {
//       console.log(`[x] cycle: ${schemaHistoryToText(schemaHistory)}`);
//       return true;
//     }

//     if (isAnyOfNode(head)) {
//       return head.anyOf
//         .map(i => findIfPossibleInSchema([...schemaHistory, i], pmHistory))
//         .some(i => i);
//     } else if (isAllOfNode(head)) {
//       // allOf nodes usually have one node with a type
//       return head.allOf
//         .filter(
//           i =>
//             isTypedNode(i) &&
//             i.type === 'object' &&
//             i.properties.type &&
//             i.properties.type.enum,
//         )
//         .map(i => findIfPossibleInSchema([...schemaHistory, i], pmHistory))
//         .some(i => i);
//     } else if (isTypedNode(head)) {
//       if (head.type === 'object') {
//         if (head.properties.type.enum[0] === possibleNodeType.name) {
//           const possible = findAllCompatibleNodeTypes(possibleNodeType);
//           if (possible && possible.length) {
//             const success = possible
//               .map(nodeType =>
//                 findIfPossibleInSchema(
//                   [...schemaHistory, head.properties.content],
//                   [...pmHistory, nodeType],
//                 ),
//               )
//               .every(i => i);
//             if (!success) {
//               throw new Error(
//                 `Could not find match for ${pmHistoryToText(
//                   pmHistory,
//                 )}. Stopped at ${schemaHistoryToText(schemaHistory)}`,
//               );
//             }
//             return success;
//           } else if (possibleNodeType.isLeaf) {
//             console.log(`[x] leaf : ${schemaHistoryToText(schemaHistory)}`);
//             return true;
//           } else {
//             console.log(
//               `${possibleNodeType.name}: ${schemaHistoryToText(schemaHistory)}`,
//             );
//             throw new Error('Not possible! Uh oh');
//           }
//         }
//         // We're allowing some false-positives thru here
//         debugger;
//         console.log(
//           `[ ] err  : ${possibleNodeType.name}:   ${schemaHistoryToText(
//             schemaHistory,
//           )}`,
//         );
//         return false;
//       } else if (head.type === 'array') {
//         return findIfPossibleInSchema(
//           [...schemaHistory, head.items],
//           pmHistory,
//         );
//       } else {
//         throw new Error(`Expected something else: ${head.type}`);
//       }
//     } else {
//       throw new Error(`${head}`);
//     }
//   };

//   findIfPossibleInSchema([adfSchema], [pmSchema.topNodeType]);
// };
