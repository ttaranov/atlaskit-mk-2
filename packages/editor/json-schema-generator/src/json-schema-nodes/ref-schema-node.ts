import SchemaNode from './schema-node';
import { getPmName } from '../utils';

export default class RefSchemaNode extends SchemaNode {
  path: string;

  constructor(path: string) {
    super();
    this.path = path;
  }

  toJSON(): object {
    return { $ref: `#/definitions/${this.path}` };
  }

  toSpec() {
    return getPmName(this.path);
  }
}
