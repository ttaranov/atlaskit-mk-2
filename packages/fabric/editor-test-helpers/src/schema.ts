export {
  AttributeSpec,
  MarkSpec,
  Node,
  NodeSpec,
  ParseRule,
  Schema,
} from 'prosemirror-model';

import {
  paragraph,
  createSchema,
  defaultSchemaMarks,
  defaultSchemaNodes,
} from '@atlaskit/editor-common';

export default createSchema({
  nodes: defaultSchemaNodes.concat(['plain']),
  marks: defaultSchemaMarks,
  customNodeSpecs: {
    plain: { ...paragraph, content: 'text*', marks: '' },
  },
});
