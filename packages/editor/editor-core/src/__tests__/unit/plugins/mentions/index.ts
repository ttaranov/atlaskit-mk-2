import { createEditor, sleep, insertText } from '@atlaskit/editor-test-helpers';
import { doc, p, typeAheadQuery } from '@atlaskit/editor-test-helpers';
import { mention as mentionData } from '@atlaskit/util-data-test';
import { selectCurrentItem } from '../../../../plugins/type-ahead/commands/select-item';
import { dismissCommand } from '../../../../plugins/type-ahead/commands/dismiss';
import { ProviderFactory } from '../../../../../../editor-common';

describe('mentionTypeahead', () => {
  const sessionIdRegex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
  const createAnalyticsEvent = jest.fn();
  const mentionProvider = new Promise<any>(resolve => {
    resolve(mentionData.storyData.resourceProvider);
  });
  const CONTAINER_ID = 'container-id';
  const OBJECT_ID = 'object-id';
  const contextIdentifierProvider = Promise.resolve({
    containerId: CONTAINER_ID,
    objectId: OBJECT_ID,
  });

  beforeEach(() => {
    createAnalyticsEvent.mockReturnValue({ fire: jest.fn() });
  });

  afterEach(() => {
    createAnalyticsEvent.mockReset();
  });

  it('should fire typeahead cancelled event', () => {
    const event: any = { fire: jest.fn() };
    const { editorView } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '@' })('@123'))),
      editorProps: { mentionProvider, contextIdentifierProvider },
      createAnalyticsEvent,
    });
    createAnalyticsEvent.mockReturnValueOnce(event);
    dismissCommand()(editorView.state, editorView.dispatch);
    expect(createAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'cancelled',
        actionSubject: 'mentionTypeahead',
        eventType: 'ui',
        source: 'unknown',
        attributes: expect.objectContaining({
          packageName: '@atlaskit/editor-core',
          packageVersion: expect.any(String),
          sessionId: expect.stringMatching(sessionIdRegex),
          spaceInQuery: false,
          queryLength: 3,
          duration: expect.any(Number),
        }),
      }),
    );
    expect(event.fire).toHaveBeenCalledTimes(1);
    expect(event.fire).toHaveBeenCalledWith('fabric-elements');
  });

  it('should fire typeahead pressed event', async () => {
    const event: any = { fire: jest.fn() };
    const providerFactory = new ProviderFactory();
    providerFactory.setProvider('mentionProvider', mentionProvider);
    providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );
    createAnalyticsEvent.mockReturnValueOnce(event);
    const { editorView, sel } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '@' })('@a{<>}'))),
      editorProps: { mentionProvider, contextIdentifierProvider },
      providerFactory,
      createAnalyticsEvent,
    });

    // Waiting for mention provider to resolve
    await sleep(100);

    insertText(editorView, 'll', sel);

    // After querying mentions search need to wait for promise to resolve
    await sleep(100);

    selectCurrentItem('enter')(editorView.state, editorView.dispatch);

    expect(createAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'pressed',
        actionSubject: 'mentionTypeahead',
        eventType: 'ui',
        source: 'unknown',
        attributes: expect.objectContaining({
          packageName: '@atlaskit/editor-core',
          packageVersion: expect.any(String),
          duration: expect.any(Number),
          position: 0,
          keyboardKey: 'enter',
          queryLength: 3,
          spaceInQuery: false,
          accessLevel: 'CONTAINER',
          userType: 'SPECIAL',
          userId: 'all',
        }),
      }),
    );
    expect(event.fire).toHaveBeenCalledTimes(1);
    expect(event.fire).toHaveBeenCalledWith('fabric-elements');
  });

  it('should fire typeahead clicked event', async () => {
    const event: any = { fire: jest.fn() };
    const providerFactory = new ProviderFactory();
    providerFactory.setProvider('mentionProvider', mentionProvider);
    providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );
    createAnalyticsEvent.mockReturnValueOnce(event);
    const { editorView, sel } = createEditor({
      doc: doc(p(typeAheadQuery({ trigger: '@' })('@a{<>}'))),
      editorProps: { mentionProvider, contextIdentifierProvider },
      providerFactory,
      createAnalyticsEvent,
    });

    // Waiting for mention provider to resolve
    await sleep(100);

    insertText(editorView, 'll', sel);

    // After querying mentions search need to wait for promise to resolve
    await sleep(100);

    selectCurrentItem()(editorView.state, editorView.dispatch);

    expect(createAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'clicked',
        actionSubject: 'mentionTypeahead',
        eventType: 'ui',
        source: 'unknown',
        attributes: expect.objectContaining({
          packageName: '@atlaskit/editor-core',
          packageVersion: expect.any(String),
          duration: expect.any(Number),
          position: 0,
          keyboardKey: undefined,
          queryLength: 3,
          spaceInQuery: false,
          accessLevel: 'CONTAINER',
          userType: 'SPECIAL',
          userId: 'all',
        }),
      }),
    );
    expect(event.fire).toHaveBeenCalledTimes(1);
    expect(event.fire).toHaveBeenCalledWith('fabric-elements');
  });
});
