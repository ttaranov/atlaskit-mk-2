import { Plugin, PluginKey } from 'prosemirror-state';
import codeMirrorNodeView from '../../../../nodeviews/ui/code-mirror';

export const stateKey = new PluginKey('codeMirrorPlugin');

export default () =>
  new Plugin({
    key: stateKey,
    props: {
      nodeViews: {
        codeBlock: codeMirrorNodeView,
      },
    },
  });
