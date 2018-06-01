/**
 * TODO:
 *   1. Deleted/inserted tableRows:
 *     Map content to inserted/deleted diff
 *   2. Deleted/inserted listItems:
 *    Map content
 *   3. Changed text formatting
 *    Map content
 *
 */

import { SequenceMatcher } from 'difflib';
import * as hash from 'object-hash';

export interface DiffOptions {
  diffOnly?: boolean;
}

const scalarizeNode = (node, scalarizeContent = false) => {
  return hash({
    ...node,
    content:
      scalarizeContent && node.content
        ? scalarize(node.content, scalarizeContent)
        : [],
  });
};

const scalarize = (arr, scalarizeContent = false) => {
  return arr.map(node => scalarizeNode(node, scalarizeContent));
};

const isDiff = n =>
  n.type === 'blockDiff' ||
  n.type === 'inlineDiff' ||
  (n.content && n.content.some(isDiff));

const diffReducer = (acc, current) => {
  const { type, content } = current;

  if (isDiff(current)) {
    switch (type) {
      case 'table':
        acc.push({
          ...current,
          content: [
            ...content.filter(
              n =>
                n.type === 'tableRow' &&
                n.content.some(c => c.type === 'tableHeader'),
            ),
            ...content.filter(isDiff),
          ],
        });

        break;

      default:
        acc.push(current);
        break;
    }
  }

  return acc;
};

const mapNode = (n, diffType) => {
  const { type, content } = n;
  switch (type) {
    case 'tableRow':
    case 'tableCell':
    case 'tableHeader':
      return {
        ...n,
        content: content.map(c => mapNode(c, diffType)),
      };
  }

  return {
    type: !!content ? 'blockDiff' : 'inlineDiff',
    attrs: {
      diffType,
    },
    content: [n],
  };
};

const getTextValue = n => {
  return (n.text || n.attrs.text || n.attrs.shortName).split('');
  // return n.text || n.attrs.text || n.attrs.shortName;
};

const getTextValue2 = (acc, n, index) => {
  // acc = [
  //   ...acc,
  //   ...(n.text || n.attrs.text || n.attrs.shortName).split('')
  // ];

  (n.text || n.attrs.text || n.attrs.shortName).split('').forEach(text => {
    acc.push({
      text,
      index,
    });
  });

  return acc;
};

const inlineReducer = (nodes, node) => {
  const lastNode = nodes[nodes.length - 1];

  if (!lastNode) {
    nodes.push(node);
    return nodes;
  }

  const newMarks = scalarize(node.marks || [], true);
  const oldMarks = scalarize(lastNode.marks || [], true);

  if (
    node.type === 'text' &&
    (!newMarks.some(mark => oldMarks.indexOf(mark) === -1) &&
      !oldMarks.some(mark => newMarks.indexOf(mark) === -1))
  ) {
    lastNode.text = `${lastNode.text}${node.text}`;
  } else {
    nodes.push(node);
  }

  return nodes;
};

const diffInlineContent = (
  content1,
  content2,
  options: DiffOptions = {},
  scalarizeContent = false,
) => {
  const node1: any[] = [];
  const node2: any[] = [];

  content1.forEach(n => {
    if (n.type === 'text') {
      const { marks } = n;
      n.text.split(/\b/g).forEach(text => {
        node1.push({
          type: 'text',
          text,
          marks,
        });
      });
    } else {
      node1.push(n);
    }
  });

  content2.forEach(n => {
    if (n.type === 'text') {
      const { marks } = n;
      n.text.split(/\b/g).forEach(text => {
        node2.push({
          type: 'text',
          text,
          marks,
        });
      });
    } else {
      node2.push(n);
    }
  });

  const a = node1.reduce(getTextValue2, []);
  const b = node2.reduce(getTextValue2, []);

  const one = scalarize(a.map(getTextValue), scalarizeContent);
  const two = scalarize(b.map(getTextValue), scalarizeContent);

  let result: any[] = [];
  const seq = new SequenceMatcher(null, one, two);
  const opcodes = seq.getOpcodes();

  opcodes.forEach((code, index) => {
    const [op, i1, i2, j1, j2] = code;

    const oldNodes = a.slice(i1, i2);
    const newNodes = b.slice(j1, j2);

    const oldContent = {};
    oldNodes.forEach(({ text, index }) => {
      if (oldContent[index]) {
        oldContent[index].text += text;
      } else {
        oldContent[index] = {
          ...node1[index],
          text,
        };
      }
    });

    const newContent = {};
    newNodes.forEach(({ text, index }) => {
      if (newContent[index]) {
        newContent[index].text += text;
      } else {
        newContent[index] = {
          ...node2[index],
          text,
        };
      }
    });

    const fixedOld = (Object as any).values(oldContent);
    const fixedNew = (Object as any).values(newContent);

    switch (op) {
      case 'replace': {
        const resultBefore = result.splice(0, i1 + 1);
        const resultAfter = result.splice(fixedNew.length);

        result = [
          ...resultBefore,
          ...fixedOld.reduce(inlineReducer, []).map(n => mapNode(n, 'delete')),
          ...fixedNew.reduce(inlineReducer, []).map(n => mapNode(n, 'insert')),
          ...resultAfter,
        ];

        break;
      }

      case 'insert': {
        const resultBefore = result.splice(0, j1 + 1);
        const resultAfter = result.splice(fixedNew.length);

        result = [
          ...resultBefore,
          ...fixedNew.reduce(inlineReducer, []).map(n => mapNode(n, 'insert')),
          ...resultAfter,
        ];
        break;
      }

      case 'delete': {
        const resultBefore = result.splice(0, i1 + 1);
        const resultAfter = result.splice(i1);

        result = [
          ...resultBefore,
          ...fixedOld.reduce(inlineReducer, []).map(n => mapNode(n, 'delete')),
          ...resultAfter,
        ];

        break;
      }

      case 'equal': {
        const resultBefore = result.splice(0, j1 + 1);
        const resultAfter = result.splice(fixedNew.length);

        const mapped = fixedNew.map((node, i) => {
          const lastNode = fixedOld[i];

          if (!lastNode) {
            return node;
          }

          const newMarks = scalarize(node.marks || [], true);
          const oldMarks = scalarize(lastNode.marks || [], true);

          if (
            node.type === 'text' &&
            (newMarks.some(mark => oldMarks.indexOf(mark) === -1) ||
              oldMarks.some(mark => newMarks.indexOf(mark) === -1))
          ) {
            return {
              type: 'inlineDiff',
              attrs: {
                diffType: 'change',
              },
              content: [node],
            };
          }

          return node;
        });

        result = [
          ...resultBefore,
          ...mapped.reduce(inlineReducer, []),
          ...resultAfter,
        ];
      }
    }
  });

  return result;
};

const diffContent = (
  node1,
  node2,
  options: DiffOptions = {},
  scalarizeContent = false,
) => {
  const one = scalarize(node1, scalarizeContent);
  const two = scalarize(node2, scalarizeContent);

  let result: any[] = [];

  const seq = new SequenceMatcher(null, one, two);
  const opcodes = seq.getOpcodes();

  const processed: any[] = [];

  opcodes.forEach((code, index) => {
    const [op, i1, i2, j1, j2] = code;

    switch (op) {
      case 'replace': {
        const nodesToDelete = node1.slice(i1, i2);
        const nodesToInsert = node2.slice(j1, j2);
        const resultBefore = result.splice(0, i1 + 1);
        const resultAfter = result.splice(j2);

        result = [
          ...resultBefore,
          ...nodesToDelete.map(n => mapNode(n, 'delete')),
          ...nodesToInsert.map(n => mapNode(n, 'insert')),
          ...resultAfter,
        ];

        break;
      }

      case 'equal': {
        const firstNodes = node1.slice(i1, i2);
        const secondNodes = node2.slice(j1, j2);

        let mapped = firstNodes.reduce((map, n, index) => {
          const { type, content } = n;

          if (content) {
            const secondContent = secondNodes[index].content;
            const contentDiff = diffContent(
              content,
              secondContent,
              options,
              false,
            );
            const contentHasDiff = contentDiff.some(
              t => t.type === 'inlineDiff' || t.type === 'blockDiff',
            );

            if (contentHasDiff) {
              const a = scalarizeNode(n, true);
              const b = scalarize(node2, true);

              // This was actually an insert!
              if (b.indexOf(a) !== -1) {
                processed.push(a);

                map.push({
                  type: 'blockDiff',
                  attrs: {
                    diffType: 'insert',
                  },
                  content: secondContent,
                });

                return map;
              }
            }

            switch (type) {
              case 'table': {
                // const secondNode = secondNodes[index];
                // const asdf = scalarize(node1, true);

                // console.log(asdf);

                // const content = secondNode.content.map(row => {
                //   if (asdf.indexOf(scalarizeNode(row, true) !== -1)) {
                //     console.log({row});
                //     return row;
                //   } else {
                //     return mapNode(row, 'insert');
                //   }

                //   return row;
                // });
                // // const a = scalarizeNode(n, true);
                // // const b = scalarize(node2, true);

                // // map.push({
                // //   ...n,
                // //   content,
                // // });

                map.push({
                  ...n,
                  content: diffContent(content, secondContent, options, true),
                });

                return map;
              }

              case 'paragraph':
                map.push({
                  ...n,
                  content: diffInlineContent(
                    content,
                    secondContent,
                    options,
                    false,
                  ),
                });

                return map;
            }

            if (contentHasDiff) {
              switch (type) {
                // TODO: Check if this still works properly with scalarizeContent
                case 'codeBlock':
                  const [del, insert] = contentDiff;
                  map.push({
                    type: 'blockDiff',
                    attrs: {
                      diffType: 'delete',
                    },
                    content: [
                      {
                        ...n,
                        content: del.content,
                      },
                    ],
                  });

                  map.push({
                    type: 'blockDiff',
                    attrs: {
                      diffType: 'insert',
                    },
                    content: [
                      {
                        ...n,
                        content: insert.content,
                      },
                    ],
                  });

                  return map;
              }
            }

            map.push({
              ...n,
              content: contentDiff,
            });

            return map;
          }

          map.push(n);

          return map;
        }, []);

        const resultBefore = result.splice(0, j1 + 1);
        const resultAfter = result.splice(j2);

        result = [...resultBefore, ...mapped, ...resultAfter];

        break;
      }

      case 'insert': {
        const nodesToInsert = node2.slice(j1, j2);
        const resultBefore = result.splice(0, j1 + 1);
        const resultAfter = result.splice(j2);

        result = [
          ...resultBefore,
          ...nodesToInsert.map(n => {
            if (processed.indexOf(scalarizeNode(n, true)) !== -1) {
              return n;
            }

            return mapNode(n, 'insert');
          }),
          ...resultAfter,
        ];

        break;
      }

      case 'delete': {
        const nodesToDelete = node1.slice(i1, i2);
        const resultBefore = result.splice(0, i1 + 1);
        const resultAfter = result.splice(i1);

        result = [
          ...resultBefore,
          ...nodesToDelete.map(n => mapNode(n, 'delete')),
          ...resultAfter,
        ];
      }
    }
  });

  // if (options.diffOnly) {
  //   return result.filter(isDiff);
  // }

  return result;
};

const diffDocs = (oldDoc, newDoc, options: DiffOptions = {}) => {
  if (oldDoc.type !== 'doc' || newDoc.type !== 'doc') {
    // TODO: Throw error?
    return;
  }

  const { content: oldContent } = oldDoc;
  const { content: newContent } = newDoc;

  let content = diffContent(oldContent, newContent, options);

  if (options.diffOnly) {
    // content = content.filter(isDiff);
    content = content.reduce(diffReducer, []);
  }

  return {
    type: 'doc',
    version: 1,
    content,
  };
};

export default diffDocs;
