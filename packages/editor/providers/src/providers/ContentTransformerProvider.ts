import { Transformer } from '@atlaskit/editor-common';
import { Schema } from 'prosemirror-model';

type ContentTransformerProvider = (schema: Schema) => Transformer<string>;
export default ContentTransformerProvider;
