import { EventEmitter } from 'events';
import { DecorationSet } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import {
  doc,
  p,
  jestProsemirrorSerializer,
  jsdomFixtures,
} from '@atlaskit/editor-test-helpers';

import { setTextSelection } from '../../../src';
import createEditor from '../../_helpers/create-editor';
import ProviderFactory from '../../../src/providerFactory';
import collabEdit, {
  pluginKey as collabEditPluginKey,
} from '../../../src/editor/plugins/collab-edit';

// Telepointers information to the snapshot { doc: {...}, selection: {...}, telepointers: [...]}
expect.addSnapshotSerializer(
  jestProsemirrorSerializer(state => {
    const { decorations } = collabEditPluginKey.getState(state);
    const telepointers = (decorations as DecorationSet)
      .find(0, state.doc.nodeSize)
      // Latest version of PM exposes `from` & `to`
      .map(({ from, to, spec: { pointer: { sessionId } } }: any) => ({
        from,
        to,
        sessionId,
      }));
    return { telepointers };
  }),
);

class MockProvider extends EventEmitter {
  initialize() {}
  send() {}
}

const setupCollabEditor = (defaultValue?: PmNode | string | Object) => {
  const providerFactory = new ProviderFactory();
  const mockProvider: any = new MockProvider();
  const providerPromise = new Promise<MockProvider>(resolve =>
    resolve(mockProvider),
  );

  providerFactory.setProvider('collabEditProvider', providerPromise);
  const { editorView } = createEditor(
    [collabEdit],
    { defaultValue },
    providerFactory,
  );

  // Work around JSDOM/Node not supporting DOM Selection API
  if (
    !('getSelection' in window) &&
    navigator.userAgent.indexOf('Node.js') !== -1
  ) {
    jsdomFixtures(editorView);
  }

  const { refs } = editorView.state.doc as any;
  if (refs) {
    // Collapsed selection.
    if ('<>' in refs) {
      setTextSelection(editorView, refs['<>']);
      // Expanded selection
    } else if ('<' in refs || '>' in refs) {
      if ('<' in refs === false) {
        throw new Error('A `<` ref must complement a `>` ref.');
      }
      if ('>' in refs === false) {
        throw new Error('A `>` ref must complement a `<` ref.');
      }
      setTextSelection(editorView, refs['<'], refs['>']);
    }
  }

  const emitTelepointer = (
    from: number,
    to: number = from,
    sessionId = 'guest',
  ) => {
    mockProvider.emit('telepointer', {
      selection: {
        type: 'textSelection',
        anchor: from,
        head: to,
      },
      sessionId,
    });
  };

  type StepType = 'replace' | 'addMark';
  const emitStep = (
    from: number,
    to: number,
    stepType: StepType = 'replace',
  ) => {
    mockProvider.emit('data', {
      json: [{ from, to, stepType }],
    });
  };

  return {
    editorView,
    providerPromise,
    emitTelepointer,
    emitStep,
  };
};

describe.only('Telepointers', () => {
  it('should be able render telepointer on empty document', async () => {
    const {
      editorView,
      providerPromise,
      emitTelepointer,
    } = setupCollabEditor();
    await providerPromise;

    emitTelepointer(1);
    expect(editorView.state).toMatchSnapshot();
  });

  it(`shouldn't remove telepointer`, async () => {
    const {
      editorView,
      providerPromise,
      emitTelepointer,
      emitStep,
    } = setupCollabEditor(doc(p('a{<>}a')));
    await providerPromise;

    emitTelepointer(1);
    emitStep(2, 3);

    expect(editorView.state).toMatchSnapshot();
  });
});
