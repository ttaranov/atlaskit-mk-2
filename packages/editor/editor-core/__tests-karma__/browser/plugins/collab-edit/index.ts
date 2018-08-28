import { expect } from 'chai';
import * as sinon from 'sinon';
import { TextSelection } from 'prosemirror-state';
import { createEditor } from '@atlaskit/editor-test-helpers';
import collabEdit, {
  pluginKey as collabEditPluginKey,
} from '../../../../src/plugins/collab-edit';
import { ProviderFactory } from '@atlaskit/editor-common';
import { collabEditProvider } from '../../../../example-helpers/mock-collab-provider';
import { findPointers } from '../../../../src/plugins/collab-edit/utils';
import tablesPlugin from '../../../../src/plugins/table';

const setupEditor = (setProvider: boolean = true) => {
  const providerFactory = new ProviderFactory();
  const providerPromise = collabEditProvider();

  if (setProvider) {
    providerFactory.setProvider('collabEditProvider', providerPromise);
  }

  const { editorView } = createEditor({
    editorPlugins: [collabEdit(), tablesPlugin()],
    providerFactory,
  });

  return {
    editorView,
    providerPromise,
  };
};

describe('editor/plugins/collab-edit', () => {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('plugin setup', () => {
    it('should fetch initial document', async () => {
      const { editorView, providerPromise } = setupEditor();
      await providerPromise;

      expect(editorView.state.doc.toJSON()).to.deep.equal({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello World',
              },
            ],
          },
        ],
      });
      editorView.destroy();
    });
  });

  describe('local changes', () => {
    it('should discard any transactions before initialized', async () => {
      const { editorView, providerPromise } = setupEditor(false);
      await providerPromise;

      editorView.dispatch(editorView.state.tr.insertText('hello world'));
      expect(editorView.state.doc.toJSON()).to.deep.equal({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
          },
        ],
      });
      editorView.destroy();
    });

    it('should call .send()-method on provider', async () => {
      const { editorView, providerPromise } = setupEditor();
      const provider = await providerPromise;
      const spy = sandbox.spy(provider, 'send');

      editorView.dispatch(editorView.state.tr.insertText('hello world'));
      expect(spy.called).to.equal(true);
      editorView.destroy();
    });
  });

  describe('remote changes', () => {
    it('should apply remote changes', async () => {
      const { editorView, providerPromise } = setupEditor();
      const provider = await providerPromise;

      provider.emit('data', {
        json: [
          {
            from: 0,
            to: editorView.state.doc.nodeSize - 2,
            stepType: 'replace',
            slice: {
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Oscar',
                    },
                  ],
                },
              ],
            },
          },
        ],
      });

      expect(editorView.state.doc.toJSON()).to.deep.equal({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Oscar',
              },
            ],
          },
        ],
      });
      editorView.destroy();
    });
  });

  describe('telepointers', () => {
    it('should emit telepointer-data for local selection changes', async () => {
      const { editorView, providerPromise } = setupEditor();
      const provider = await providerPromise;
      const spy = sandbox.spy(provider, 'sendMessage');

      const { doc, tr } = editorView.state;
      tr
        .setMeta('sessionId', { sid: 'test' })
        .setSelection(TextSelection.create(doc, 13));
      editorView.dispatch(tr);
      // Wait for next tick
      await new Promise(resolve => setTimeout(resolve, 0));
      sinon.assert.calledOnce(spy);

      sinon.assert.calledWith(spy, {
        type: 'telepointer',
        selection: {
          type: 'textSelection',
          anchor: 13,
          head: 13,
        },
        sessionId: 'test',
      });
      editorView.destroy();
    });

    it('should keep track of remote telepointers in plugin state', async () => {
      const { editorView, providerPromise } = setupEditor();
      const provider = await providerPromise;

      provider.emit('presence', {
        left: [],
        joined: [
          {
            sessionId: 'test',
            lastActive: 1,
            name: 'Foo',
            avatar: 'avatar.png',
          },
        ],
      });

      provider.emit('telepointer', {
        type: 'telepointer',
        selection: {
          type: 'textSelection',
          anchor: 5,
          head: 5,
        },
        sessionId: 'test',
      });

      const { decorations } = collabEditPluginKey.getState(editorView.state);

      expect(findPointers('test', decorations)![0].spec).to.deep.equal({
        pointer: {
          sessionId: 'test',
        },
      });
      editorView.destroy();
    });

    it('should place cursor ', async () => {
      const { editorView, providerPromise } = setupEditor();
      const provider = await providerPromise;

      provider.emit('presence', {
        left: [],
        joined: [
          {
            sessionId: 'test',
            lastActive: 1,
            name: 'Foo',
            avatar: 'avatar.png',
          },
        ],
      });

      provider.emit('telepointer', {
        type: 'telepointer',
        selection: {
          type: 'textSelection',
          anchor: 5,
          head: 5,
        },
        sessionId: 'test',
      });

      provider.emit('data', {
        json: [
          {
            stepType: 'replace',
            from: 0,
            to: 13,
            slice: {
              content: [
                {
                  type: 'table',
                  attrs: {
                    isNumberColumnEnabled: false,
                    layout: 'default',
                  },
                  content: [
                    {
                      type: 'tableRow',
                      content: [
                        {
                          type: 'tableCell',
                          attrs: {
                            colspan: 1,
                            rowspan: 1,
                            colwidth: null,
                            background: null,
                          },
                          content: [
                            {
                              type: 'paragraph',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      });
      // tableCommands.createTable()(editorView.state, editorView.dispatch);
      // Wait for next tick
      await new Promise(resolve => setTimeout(resolve, 20));
      const decorations = collabEditPluginKey.getState(editorView.state)
        .decorations;
      expect(findPointers('test', decorations)![0].from).to.eq(4);
    });
  });

  describe('presence', () => {
    it('should add new participants', async () => {
      const { editorView, providerPromise } = setupEditor();
      const provider = await providerPromise;

      provider.emit('presence', {
        left: [],
        joined: [
          {
            sessionId: 'test',
            lastActive: 1,
            avatar: 'avatar.png',
          },
        ],
      });

      const { activeParticipants } = collabEditPluginKey.getState(
        editorView.state,
      );
      expect(activeParticipants.toArray()).to.deep.equal([
        {
          avatar: 'avatar.png',
          lastActive: 1,
          sessionId: 'test',
        },
      ]);
      editorView.destroy();
    });

    it('should remove participants who left', async () => {
      const { editorView, providerPromise } = setupEditor();
      const provider = await providerPromise;

      provider.emit('presence', {
        joined: [
          {
            sessionId: 'test',
            lastActive: 1,
            avatar: 'avatar.png',
          },
          {
            sessionId: 'test-2',
            lastActive: 1,
            avatar: 'avatar-2.png',
          },
        ],
      });

      provider.emit('presence', {
        left: [
          {
            sessionId: 'test',
          },
        ],
      });

      const { activeParticipants } = collabEditPluginKey.getState(
        editorView.state,
      );
      expect(activeParticipants.toArray()).to.deep.equal([
        {
          sessionId: 'test-2',
          lastActive: 1,
          avatar: 'avatar-2.png',
        },
      ]);
      editorView.destroy();
    });
  });
});
