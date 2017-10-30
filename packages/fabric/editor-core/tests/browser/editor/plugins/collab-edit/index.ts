import { expect } from 'chai';
import * as sinon from 'sinon';
import createEditor from '../../../../helpers/create-editor';
import collabEdit, { pluginKey as collabEditPluginKey } from '../../../../../src/editor/plugins/collab-edit';
import ProviderFactory from '../../../../../src/providerFactory';
import { MockCollabEditProvider } from '../../../../../stories/mock-collab-provider';
import { findPointer } from '../../../../../src/editor/plugins/collab-edit/utils';

const setupEditor = (setProvider: boolean = true) => {
  const providerFactory = new ProviderFactory();
  const providerPromise = Promise.resolve(new MockCollabEditProvider());

  if (setProvider) {
    providerFactory.setProvider('collabEditProvider', providerPromise);
  }

  const { editorView } = createEditor([collabEdit], {}, providerFactory);

  return {
    editorView,
    providerPromise
  };
};

describe('editor/plugins/collab-edit', () => {

  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });


  describe('plugin setup', () => {

    it('should fetch initial document', async () => {
      const { editorView, providerPromise } = setupEditor();
      await providerPromise;

      expect(editorView.state.doc.toJSON()).to.deep.equal({
        'type': 'doc',
        'content': [
          {
            'type': 'paragraph',
            'content': [
              {
                'type': 'text',
                'text': 'Hello World'
              }
            ]
          }
        ]
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
        'type': 'doc',
        'content': [
          {
            'type': 'paragraph'
          }
        ]
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
            'from': 0,
            'to': editorView.state.doc.nodeSize - 2,
            'stepType': 'replace',
            'slice': {
              'content': [
                {
                  'type': 'paragraph',
                  'content': [
                    {
                      'type': 'text',
                      'text': 'Oscar'
                    }
                  ]
                }
              ]
            }
          }
        ]
      });

      expect(editorView.state.doc.toJSON()).to.deep.equal({
        'type': 'doc',
        'content': [
          {
            'type': 'paragraph',
            'content': [
              {
                'type': 'text',
                'text': 'Oscar'
              }
            ]
          }
        ]
      });
      editorView.destroy();
    });
  });

  describe('telepointers', () => {

    it('should emit telepointer-data for local changes', async () => {
      const { editorView, providerPromise } = setupEditor();
      const provider = await providerPromise;
      const spy = sandbox.spy(provider, 'sendMessage');

      const { tr } = editorView.state;
      tr.setMeta('sessionId', { sid: 'test' });
      tr.insertText('!');
      editorView.dispatch(tr);

      expect(spy.called).to.equal(true);
      expect(spy.calledWith({
        'type': 'telepointer',
        'selection': {
          'type': 'textSelection',
          'anchor': 13,
          'head': 13
        },
        'sessionId': 'test'
      })).to.equal(true);
      editorView.destroy();
    });

    it('should keep track of remote telepointers in plugin state', async () => {
      const { editorView, providerPromise } = setupEditor();
      const provider = await providerPromise;

      provider.emit('telepointer', {
        'type': 'telepointer',
        'selection': {
          'type': 'textSelection',
          'anchor': 5,
          'head': 5
        },
        'sessionId': 'test'
      });

      const { decorations } = collabEditPluginKey.getState(editorView.state);

      expect(findPointer('test', decorations)!.spec).to.deep.equal({
        'pointer': {
          'sessionId': 'test'
        }
      });
      editorView.destroy();
    });

  });

  // tslint:disable-next-line:no-only-tests
  describe('presence', () => {
    it('should add new participants', async () => {
      const { editorView, providerPromise } = setupEditor();
      const provider = await providerPromise;

      provider.emit('presence', {
        'left': [],
        'joined': [{
          'sessionId': 'test',
          'lastActive': 1,
          'avatar': 'avatar.png'
        }]
      });

      const { activeParticipants } = collabEditPluginKey.getState(editorView.state);
      expect(activeParticipants).to.deep.equal([{
        'avatar': 'avatar.png',
        'lastActive': 1,
        'sessionId': 'test'
      }]);
      editorView.destroy();
    });

    it('should remove participants who left', async () => {
      const { editorView, providerPromise } = setupEditor();
      const provider = await providerPromise;

      provider.emit('presence', {
        'joined': [
          {
            'sessionId': 'test',
            'lastActive': 1,
            'avatar': 'avatar.png'
          },
          {
            'sessionId': 'test-2',
            'lastActive': 1,
            'avatar': 'avatar-2.png'
          },
        ]
      });

      provider.emit('presence', {
        'left': [{
          'sessionId': 'test',
        }],
      });

      const { activeParticipants } = collabEditPluginKey.getState(editorView.state);
      expect(activeParticipants).to.deep.equal([{
        'sessionId': 'test-2',
        'lastActive': 1,
        'avatar': 'avatar-2.png'
      }]);
      editorView.destroy();
    });
  });


});
