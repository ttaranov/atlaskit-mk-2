import {
  a,
  blockquote,
  decisionItem,
  decisionList,
  doc,
  getLinkCreateContextMock,
  createEditor,
  media,
  mediaGroup,
  p,
  randomId,
  taskItem,
  taskList,
} from '@atlaskit/editor-test-helpers';

import {
  insertLinks,
  detectLinkRangesInSteps,
} from '../../../../plugins/media/utils/media-links';
import * as utils from '../../../../utils/input-rules';
import mediaPlugin from '../../../../plugins/media';
import tasksAndDecisionsPlugin from '../../../../plugins/tasks-and-decisions';
import { DefaultMediaStateManager } from '../../../../plugins/media';
import { AnalyticsHandler, analyticsService } from '../../../../analytics';

describe('media-links', () => {
  const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
  const testLinkId = `mock-link-id${randomId()}`;
  const testUuid = '1234';
  const linkCreateContextMock = getLinkCreateContextMock(testLinkId);
  const createTempId = url => `temporary:${testUuid}:${url}`;
  const readyState = (id, publicId = testLinkId) => ({
    id,
    publicId,
    status: 'ready',
  });

  const editor = (doc: any, uploadErrorHandler?: () => void) =>
    createEditor({
      doc,
      editorPlugins: [mediaPlugin(), tasksAndDecisionsPlugin],
      editorProps: {
        uploadErrorHandler,
      },
    });

  let uuidStub: jest.SpyInstance<any>;
  let mediaStateManager;

  beforeEach(() => {
    uuidStub = jest.spyOn(utils, 'uuid');
    uuidStub.mockImplementation(() => testUuid);
    mediaStateManager = new DefaultMediaStateManager();
  });

  afterEach(() => {
    uuidStub.mockRestore();
    mediaStateManager.destroy();
  });

  describe('detectLinkRangesInSteps', () => {
    describe('when includes replace step with links', () => {
      it('returns ranges with links', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));
        const { state } = editorView;

        const href1 = 'www.google.com';
        const title1 = 'google';
        const href2 = 'www.baidu.com';

        const link1 = a({ href: href1 })(title1);
        const link2 = a({ href: href2 })('baidu');
        const nodes = link1(editorView.state.schema).concat(
          link2(editorView.state.schema),
        );
        const tr = state.tr.replaceWith(sel, sel, nodes);

        const linksRanges = detectLinkRangesInSteps(
          tr,
          editorView.state.schema.marks.link,
          0,
        );
        expect(linksRanges).toEqual([
          { href: href1, pos: 0 },
          { href: href2, pos: title1.length },
        ]);
        editorView.destroy();
      });

      it('detects links inside nested content', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));
        const { state } = editorView;

        const href1 = 'www.google.com';
        const title1 = 'google';
        const href2 = 'www.baidu.com';

        const link1 = a({ href: href1 })(title1);
        const link2 = a({ href: href2 })('baidu');
        const node = blockquote(p(link1, link2))(editorView.state.schema);
        const tr = state.tr.replaceWith(sel - 1, sel + 1, node);

        const linksRanges = detectLinkRangesInSteps(
          tr,
          editorView.state.schema.marks.link,
          0,
        );

        // blockquote > p = 2
        expect(linksRanges).toEqual([
          { href: href1, pos: 2 },
          { href: href2, pos: 2 + title1.length },
        ]);
        editorView.destroy();
      });

      describe('when included link has no href', () => {
        it('ignore links without href', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          const { state } = editorView;

          const href1 = '';
          const title1 = 'google';
          const href2 = 'www.baidu.com';

          const link1 = a({ href: href1 })(title1);
          const link2 = a({ href: href2 })('baidu');
          const nodes = link1(editorView.state.schema).concat(
            link2(editorView.state.schema),
          );
          const tr = state.tr.replaceWith(sel, sel, nodes);

          const linksRanges = detectLinkRangesInSteps(
            tr,
            editorView.state.schema.marks.link,
            0,
          );

          expect(linksRanges).toEqual([{ href: href2, pos: title1.length }]);
          editorView.destroy();
        });
      });
    });

    describe('when includes add mark step with links', () => {
      it('returns ranges with links', () => {
        const text = 'hello';
        const href = 'www.atlassian.com';
        const { editorView, sel } = editor(doc(p(`${text}{<>}`)));
        const { state } = editorView;
        const linkMark = state.schema.marks.link.create({ href });
        const tr = state.tr.addMark(sel - text.length, sel, linkMark);

        const linksRanges = detectLinkRangesInSteps(
          tr,
          editorView.state.schema.marks.link,
          0,
        );

        expect(linksRanges).toEqual([{ href, pos: 1 }]);
        editorView.destroy();
      });

      describe('when included link has no href', () => {
        it('ignore links without href', () => {
          const text = 'hello';
          const { editorView, sel } = editor(doc(p(`${text}{<>}`)));
          const { state } = editorView;
          const linkMark = state.schema.marks.link.create({ href: '' });
          const tr = state.tr.addMark(sel - text.length, sel, linkMark);

          const linksRanges = detectLinkRangesInSteps(
            tr,
            editorView.state.schema.marks.link,
            0,
          );

          expect(linksRanges).toEqual([]);
          editorView.destroy();
        });
      });
    });

    describe('when both replace step and add mark step have links', () => {
      it('returns ranges with links', () => {
        const text = 'hello';
        const { editorView, sel } = editor(doc(p(`${text}{<>}`)));
        const { state } = editorView;

        const href1 = 'www.google.com';
        const title1 = 'google';
        const href2 = 'www.baidu.com';
        const href3 = 'www.atlassian.com';

        const link1 = a({ href: href1 })(title1);
        const link2 = a({ href: href2 })('baidu');
        const nodes = link1(editorView.state.schema).concat(
          link2(editorView.state.schema),
        );
        const linkMark = state.schema.marks.link.create({ href: href3 });
        const tr = state.tr
          .replaceWith(sel, sel, nodes)
          .addMark(sel - text.length, sel, linkMark);

        const linksRanges = detectLinkRangesInSteps(
          tr,
          editorView.state.schema.marks.link,
          0,
        );

        expect(linksRanges).toEqual([
          { href: href1, pos: 0 },
          { href: href2, pos: title1.length },
          { href: href3, pos: 1 },
        ]);
        editorView.destroy();
      });
    });

    describe('when remove step with links', () => {
      it('returns empty ranges', () => {
        const text = 'hello';
        const href = 'www.google.com';
        const link = a({ href })(`${text}{<>}`);
        const { editorView, sel } = editor(doc(p(link)));
        const { state } = editorView;
        const tr = state.tr.removeMark(
          sel - text.length,
          sel,
          state.schema.marks.link.create({ href }),
        );

        const linksRanges = detectLinkRangesInSteps(
          tr,
          editorView.state.schema.marks.link,
          0,
        );

        expect(linksRanges).toEqual([]);
        editorView.destroy();
      });
    });

    describe('when neither replace step nor add mark step have links', () => {
      it('returns empty ranges', () => {
        const text = 'hello';
        const { editorView, sel } = editor(doc(p(`${text}{<>}`)));
        const { state } = editorView;
        const newText = state.schema.text('yay');
        const strongMark = state.schema.marks.strong.create();
        const tr = state.tr
          .replaceWith(sel, sel, newText)
          .addMark(sel - text.length, sel, strongMark);

        const linksRanges = detectLinkRangesInSteps(
          tr,
          editorView.state.schema.marks.link,
          0,
        );

        expect(linksRanges).toEqual([]);
        editorView.destroy();
      });
    });
  });

  describe('insertLinks', () => {
    describe('when no links are stored in link ranges', () => {
      it('does nothing', async () => {
        const text = 'www.google.com';
        const { editorView } = editor(doc(p(`${text} {<>}`)));
        const handle = jest.fn();

        await insertLinks(
          editorView,
          mediaStateManager,
          handle,
          [],
          linkCreateContextMock,
          testCollectionName,
        );

        expect(handle).not.toHaveBeenCalled();
        expect(editorView.state.doc).toEqualDocument(doc(p(`${text} `)));
        editorView.destroy();
      });
    });

    describe('when there is a link stored in link ranges', () => {
      describe('there is no existing media group below', () => {
        it('creates a link card below where is the link created', async () => {
          const href = 'www.google.com';
          const { editorView } = editor(doc(p(`${href} {<>}`)));
          const handle = jest.fn();

          // -1 for space, simulate the scenario of autoformatting link
          await insertLinks(
            editorView,
            mediaStateManager,
            handle,
            [{ href, pos: 1 }],
            linkCreateContextMock,
            testCollectionName,
          );

          const id = createTempId(href);
          expect(handle).toHaveBeenCalledWith(readyState(id));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(`${href} `),
              mediaGroup(
                media({ id, type: 'link', collection: testCollectionName })(),
              ),
              p(),
            ),
          );
          editorView.destroy();
        });

        describe('latest pos in range is out of doc range', () => {
          it('creates a link card at the end of doc', async () => {
            const href = 'www.google.com';
            const { editorView } = editor(doc(p(`${href} {<>}`)));
            const handle = jest.fn();

            // -1 for space, simulate the scenario of autoformatting link
            await insertLinks(
              editorView,
              mediaStateManager,
              handle,
              [{ href, pos: 1000 }],
              linkCreateContextMock,
              testCollectionName,
            );

            const id = createTempId(href);
            expect(handle).toHaveBeenCalledWith(readyState(id));
            expect(editorView.state.doc).toEqualDocument(
              doc(
                p(`${href} `),
                mediaGroup(
                  media({ id, type: 'link', collection: testCollectionName })(),
                ),
                p(),
              ),
            );
            editorView.destroy();
          });
        });

        describe('link inserted inside blockquote', () => {
          it('should create media group below it', async () => {
            const href = 'www.google.com';
            const { editorView } = editor(doc(blockquote(p(`${href} {<>}`))));
            const handle = jest.fn();

            // -1 for space, simulate the scenario of autoformatting link
            await insertLinks(
              editorView,
              mediaStateManager,
              handle,
              [{ href, pos: 1000 }],
              linkCreateContextMock,
              testCollectionName,
            );

            const id = createTempId(href);
            expect(handle).toHaveBeenCalledWith(readyState(id));
            expect(editorView.state.doc).toEqualDocument(
              doc(
                blockquote(p(`${href} `)),
                mediaGroup(
                  media({ id, type: 'link', collection: testCollectionName })(),
                ),
                p(),
              ),
            );
            editorView.destroy();
          });
        });

        describe('not at the end of the doc', () => {
          it('does not create a new p at the end of doc', async () => {
            const href = 'www.google.com';
            const { editorView } = editor(doc(p(`${href} {<>}`), p('hello')));
            const handle = jest.fn();

            await insertLinks(
              editorView,
              mediaStateManager,
              handle,
              [{ href, pos: 1 }],
              linkCreateContextMock,
              testCollectionName,
            );

            const id = createTempId(href);
            expect(handle).toHaveBeenCalledWith(readyState(id));
            expect(editorView.state.doc).toEqualDocument(
              doc(
                p(`${href} `),
                mediaGroup(
                  media({ id, type: 'link', collection: testCollectionName })(),
                ),
                p('hello'),
              ),
            );
            editorView.destroy();
          });
        });

        it('triggers an analytics event', async () => {
          const href = 'www.google.com';
          const { editorView } = editor(doc(p(`${href} {<>}`)));
          const spy = jest.fn();
          analyticsService.handler = spy as AnalyticsHandler;

          afterEach(() => {
            analyticsService.handler = null;
          });
          await insertLinks(
            editorView,
            mediaStateManager,
            () => {},
            [{ href, pos: 1 }],
            linkCreateContextMock,
            testCollectionName,
          );

          expect(spy).toHaveBeenCalledWith('atlassian.editor.media.link');
          editorView.destroy();
        });
      });

      describe('there is an existing media group below', () => {
        it('creates a link card to join the existing media group below', async () => {
          const hrefOld = 'www.google.com';
          const href = 'www.baidu.com';
          const { editorView } = editor(
            doc(
              p(`${hrefOld} ${href} {<>}`),
              mediaGroup(
                media({
                  id: testLinkId,
                  type: 'link',
                  collection: testCollectionName,
                })(),
              ),
            ),
          );
          const handle = jest.fn();

          // -1 for space, simulate the scenario of autoformatting link
          await insertLinks(
            editorView,
            mediaStateManager,
            handle,
            [{ href, pos: hrefOld.length + 2 }],
            linkCreateContextMock,
            testCollectionName,
          );

          const id = createTempId(href);
          expect(handle).toHaveBeenCalledWith(readyState(id));
          expect(editorView.state.doc).toEqualDocument(
            doc(
              p(`${hrefOld} ${href} `),
              mediaGroup(
                media({
                  id: testLinkId,
                  type: 'link',
                  collection: testCollectionName,
                })(),
                media({ id, type: 'link', collection: testCollectionName })(),
              ),
            ),
          );
          editorView.destroy();
        });

        describe('latest pos in range is out of doc range', () => {
          it('creates a link card to join the existing media group below', async () => {
            const hrefOld = 'www.google.com';
            const href = 'www.baidu.com';
            const { editorView } = editor(
              doc(
                p(`${hrefOld} ${href} {<>}`),
                mediaGroup(
                  media({
                    id: testLinkId,
                    type: 'link',
                    collection: testCollectionName,
                  })(),
                ),
              ),
            );
            const handle = jest.fn();

            // -1 for space, simulate the scenario of autoformatting link
            await insertLinks(
              editorView,
              mediaStateManager,
              handle,
              [{ href, pos: 1000 }],
              linkCreateContextMock,
              testCollectionName,
            );

            const id = createTempId(href);
            expect(handle).toHaveBeenCalledWith(readyState(id));
            expect(editorView.state.doc).toEqualDocument(
              doc(
                p(`${hrefOld} ${href} `),
                mediaGroup(
                  media({
                    id: testLinkId,
                    type: 'link',
                    collection: testCollectionName,
                  })(),
                  media({ id, type: 'link', collection: testCollectionName })(),
                ),
              ),
            );
            editorView.destroy();
          });
        });
      });
    });

    describe('when there are multiple links in link ranges', () => {
      it('creates link cards below the range where link was detected', async () => {
        const href1 = 'www.google.com';
        const href2 = 'www.baidu.com';
        const href3 = 'www.atlassian.com';
        const { editorView } = editor(
          doc(p(`{<>}${href1}`), p(`${href2} ${href3}`), p('hello')),
        );
        const handle = jest.fn();

        const posOfLink1 = 1;
        const posOfLink2 = posOfLink1 + href1.length + 2;
        const posOfLink3 = posOfLink2 + href2.length + 1;

        // -1 for space, simulate the scenario of autoformatting link
        await insertLinks(
          editorView,
          mediaStateManager,
          handle,
          [
            { href: href1, pos: posOfLink1 },
            { href: href2, pos: posOfLink2 },
            { href: href3, pos: posOfLink3 },
          ],
          linkCreateContextMock,
          testCollectionName,
        );

        const tempId1 = createTempId(href1);
        const tempId2 = createTempId(href2);
        const tempId3 = createTempId(href3);
        expect(handle).toHaveBeenCalledTimes(3);
        expect(handle).toHaveBeenCalledWith(readyState(tempId1));
        expect(handle).toHaveBeenCalledWith(readyState(tempId2));
        expect(handle).toHaveBeenLastCalledWith(readyState(tempId3));
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(`${href1}`),
            mediaGroup(
              media({
                id: tempId1,
                type: 'link',
                collection: testCollectionName,
              })(),
            ),
            p(`${href2} ${href3}`),
            mediaGroup(
              media({
                id: tempId2,
                type: 'link',
                collection: testCollectionName,
              })(),
              media({
                id: tempId3,
                type: 'link',
                collection: testCollectionName,
              })(),
            ),
            p('hello'),
          ),
        );
        editorView.destroy();
      });
    });

    it('should call remove callback for invalid or private links', async () => {
      const href = 'http://localhost';
      const { editorView } = editor(doc(p(`${href} {<>}`)));
      const handle = jest.fn();

      const id = createTempId(href);
      const addLinkItemStub = jest.spyOn(linkCreateContextMock, 'addLinkItem');
      addLinkItemStub.mockImplementation(() => Promise.reject('error message'));
      await insertLinks(
        editorView,
        mediaStateManager,
        handle,
        [{ href, pos: 1 }],
        linkCreateContextMock,
        testCollectionName,
      );
      addLinkItemStub.mockRestore();

      expect(handle).toHaveBeenCalledWith({
        id,
        error: 'error message',
        status: 'error',
      });
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(`${href} `),
          mediaGroup(
            media({ id, type: 'link', collection: testCollectionName })(),
          ),
          p(),
        ),
      );
      editorView.destroy();
    });
  });

  describe('when selection is in a task or decision block', () => {
    it('link insertion ignored for task item', async () => {
      const itemDoc = doc(
        taskList({ localId: 'id' })(taskItem({ localId: 'id' })('{<>}')),
      );
      const { editorView } = editor(itemDoc);
      const handle = jest.fn();

      await insertLinks(
        editorView,
        mediaStateManager,
        handle,
        [],
        linkCreateContextMock,
        testCollectionName,
      );

      expect(handle).not.toHaveBeenCalled();
      expect(editorView.state.doc).toEqualDocument(itemDoc);
      editorView.destroy();
    });

    it('link insertion ignored for decision item', async () => {
      const decisionDoc = doc(
        decisionList({ localId: 'id' })(
          decisionItem({ localId: 'id' })('{<>}'),
        ),
      );
      const { editorView } = editor(decisionDoc);
      const handle = jest.fn();

      await insertLinks(
        editorView,
        mediaStateManager,
        handle,
        [],
        linkCreateContextMock,
        testCollectionName,
      );

      expect(handle).not.toHaveBeenCalled();
      expect(editorView.state.doc).toEqualDocument(decisionDoc);
      editorView.destroy();
    });
  });
});
