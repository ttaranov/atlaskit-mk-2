import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { DefaultMediaStateManager } from '@atlaskit/media-core';

import {
  MediaPluginState,
  AnalyticsHandler,
  analyticsService
} from '../../../../src';

import {
  a,
  blockquote,
  chaiPlugin,
  decisionItem,
  decisionList,
  doc,
  getLinkCreateContextMock,
  makeEditor,
  media,
  mediaGroup,
  p,
  randomId,
  taskItem,
  taskList,
} from '../../../../src/test-helper';

import defaultSchema from '../../../../src/test-helper/schema';
import { insertLinks, detectLinkRangesInSteps } from '../../../../src/plugins/media/media-links';
import * as utils from '../../../../src/plugins/utils';

chai.use(chaiPlugin);

describe('media-links', () => {
  const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
  const testLinkId = `mock-link-id${randomId()}`;
  const testUuid = '1234';
  const linkCreateContextMock = getLinkCreateContextMock(testLinkId);
  const createTempId = url => `temporary:${testUuid}:${url}`;
  const readyState = (id, publicId = testLinkId) => ({id, publicId, status: 'ready'});

  const editor = (doc: any, uploadErrorHandler?: () => void) => makeEditor<MediaPluginState>({
    doc,
    schema: defaultSchema,
  });

  let uuidStub: sinon.SinonStub;
  let mediaStateManager;
  before(() => {
    uuidStub = sinon.stub(utils, 'uuid').returns(testUuid);
    mediaStateManager = new DefaultMediaStateManager();
  });

  after(() => {
    uuidStub.restore();
    mediaStateManager.destroy();
  });

  describe('detectLinkRangesInSteps', () => {
    context('when includes replace step with links', () => {
      it('returns ranges with links', () => {
        const { editorView, sel } = editor(doc(p('{<>}')));
        const { state } = editorView;

        const href1 = 'www.google.com';
        const title1 = 'google';
        const href2 = 'www.baidu.com';

        const link1 = a({ href: href1 })(title1);
        const link2 = a({ href: href2 })('baidu');
        const nodes = link1.concat(link2);
        const tr = state.tr.replaceWith(sel, sel, nodes);

        const linksRanges = detectLinkRangesInSteps(tr, editorView.state.schema.marks.link, 0);
        expect(linksRanges).to.deep.equal([
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
        const node = blockquote(p(link1, link2));
        const tr = state.tr.replaceWith(sel - 1, sel + 1, node);

        const linksRanges = detectLinkRangesInSteps(tr, editorView.state.schema.marks.link, 0);

        // blockquote > p = 2
        expect(linksRanges).to.deep.equal([
          { href: href1, pos: 2 },
          { href: href2, pos: 2 + title1.length },
        ]);
        editorView.destroy();
      });

      context('when included link has no href', () => {
        it('ignore links without href', () => {
          const { editorView, sel } = editor(doc(p('{<>}')));
          const { state } = editorView;

          const href1 = '';
          const title1 = 'google';
          const href2 = 'www.baidu.com';

          const link1 = a({ href: href1 })(title1);
          const link2 = a({ href: href2 })('baidu');
          const nodes = link1.concat(link2);
          const tr = state.tr.replaceWith(sel, sel, nodes);

          const linksRanges = detectLinkRangesInSteps(tr, editorView.state.schema.marks.link, 0);

          expect(linksRanges).to.deep.equal([
            { href: href2, pos: title1.length },
          ]);
          editorView.destroy();
        });
      });
    });

      context('when includes add mark step with links', () => {
      it('returns ranges with links', () => {
        const text = 'hello';
        const href = 'www.atlassian.com';
        const { editorView, sel } = editor(doc(p(`${text}{<>}`)));
        const { state } = editorView;
        const linkMark = state.schema.marks.link.create({ href });
        const tr = state.tr.addMark(sel - text.length, sel, linkMark);

        const linksRanges = detectLinkRangesInSteps(tr, editorView.state.schema.marks.link, 0);

        expect(linksRanges).to.deep.equal([
          { href, pos: 1 },
        ]);
        editorView.destroy();
      });

      context('when included link has no href', () => {
        it('ignore links without href', () => {
          const text = 'hello';
          const { editorView, sel } = editor(doc(p(`${text}{<>}`)));
          const { state } = editorView;
          const linkMark = state.schema.marks.link.create({ href: '' });
          const tr = state.tr.addMark(sel - text.length, sel, linkMark);

          const linksRanges = detectLinkRangesInSteps(tr, editorView.state.schema.marks.link, 0);

          expect(linksRanges).to.deep.equal([]);
          editorView.destroy();
        });
      });
    });

    context('when both replace step and add mark step have links', () => {
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
        const nodes = link1.concat(link2);
        const linkMark = state.schema.marks.link.create({ href: href3 });
        const tr = state.tr
          .replaceWith(sel, sel, nodes)
          .addMark(sel - text.length, sel, linkMark);

        const linksRanges = detectLinkRangesInSteps(tr, editorView.state.schema.marks.link, 0);

        expect(linksRanges).to.deep.equal([
          { href: href1, pos: 0 },
          { href: href2, pos: title1.length },
          { href: href3, pos: 1 },
        ]);
        editorView.destroy();
      });
    });

    context('when remove step with links', () => {
      it('returns empty ranges', () => {
        const text = 'hello';
        const href = 'www.google.com';
        const link = a({ href })(`${text}{<>}`);
        const { editorView, sel } = editor(doc(p(link)));
        const { state } = editorView;
        const tr = state.tr
          .removeMark(sel - text.length, sel, state.schema.marks.link.create({ href }));

        const linksRanges = detectLinkRangesInSteps(tr, editorView.state.schema.marks.link, 0);

        expect(linksRanges).to.deep.equal([]);
        editorView.destroy();
      });
    });

    context('when neither replace step nor add mark step have links', () => {
      it('returns empty ranges', () => {
        const text = 'hello';
        const { editorView, sel } = editor(doc(p(`${text}{<>}`)));
        const { state } = editorView;
        const newText = state.schema.text('yay');
        const strongMark = state.schema.marks.strong.create();
        const tr = state.tr
          .replaceWith(sel, sel, newText)
          .addMark(sel - text.length, sel, strongMark);

        const linksRanges = detectLinkRangesInSteps(tr, editorView.state.schema.marks.link, 0);

        expect(linksRanges).to.deep.equal([]);
        editorView.destroy();
      });
    });
  });

  describe('insertLinks', () => {
    context('when no links are stored in link ranges', () => {
      it('does nothing', async () => {
        const text = 'www.google.com';
        const { editorView } = editor(doc(p(`${text} {<>}`)));
        const handle = sinon.spy();

        await insertLinks(
          editorView,
          mediaStateManager,
          handle,
          [],
          linkCreateContextMock,
          testCollectionName,
        );

        sinon.assert.notCalled(handle);
        expect(editorView.state.doc).to.deep.equal(doc(p(`${text} `)));
        editorView.destroy();
      });
    });

    context('when there is a link stored in link ranges', () => {
      context('there is no existing media group below', () => {
        it('creates a link card below where is the link created', async () => {
          const href = 'www.google.com';
          const { editorView } = editor(doc(p(`${href} {<>}`)));
          const handle = sinon.spy();

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
          sinon.assert.alwaysCalledWithExactly(handle, readyState(id));
          expect(editorView.state.doc).to.deep.equal(doc(
            p(`${href} `),
            mediaGroup(media({ id, type: 'link', collection: testCollectionName })),
            p(),
          ));
          editorView.destroy();
        });

        context('latest pos in range is out of doc range', () => {
          it('creates a link card at the end of doc', async () => {
            const href = 'www.google.com';
            const { editorView } = editor(doc(p(`${href} {<>}`)));
            const handle = sinon.spy();

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
            sinon.assert.alwaysCalledWithExactly(handle, readyState(id));
            expect(editorView.state.doc).to.deep.equal(doc(
              p(`${href} `),
              mediaGroup(media({ id, type: 'link', collection: testCollectionName })),
              p(),
            ));
            editorView.destroy();
          });
        });

        context('not at the end of the doc', () => {
          it('does not create a new p at the end of doc', async () => {
            const href = 'www.google.com';
            const { editorView } = editor(doc(
              p(`${href} {<>}`),
              p('hello'),
            ));
            const handle = sinon.spy();

            await insertLinks(
              editorView,
              mediaStateManager,
              handle,
              [{ href, pos: 1 }],
              linkCreateContextMock,
              testCollectionName,
            );

            const id = createTempId(href);
            sinon.assert.alwaysCalledWithExactly(handle, readyState(id));
            expect(editorView.state.doc).to.deep.equal(doc(
              p(`${href} `),
              mediaGroup(media({ id, type: 'link', collection: testCollectionName })),
              p('hello'),
            ));
            editorView.destroy();
          });
        });

        it('triggers an analytics event', async () => {
          const href = 'www.google.com';
          const { editorView } = editor(doc(p(`${href} {<>}`)));
          const spy = sinon.spy();
          analyticsService.handler = (spy as AnalyticsHandler);

          afterEach(() => {
            analyticsService.handler = null;
          });
          await insertLinks(
            editorView,
            mediaStateManager,
            () => {},
            [{ href, pos: 1 }],
            linkCreateContextMock,
            testCollectionName
          );

          sinon.assert.alwaysCalledWithExactly(spy, 'atlassian.editor.media.link');
          editorView.destroy();
        });
      });

      context('there is an existing media group below', () => {
        it('creates a link card to join the existing media group below', async () => {
          const hrefOld = 'www.google.com';
          const href = 'www.baidu.com';
          const { editorView } = editor(doc(
            p(`${hrefOld} ${href} {<>}`),
            mediaGroup(media({ id: testLinkId, type: 'link', collection: testCollectionName })),
          ));
          const handle = sinon.spy();

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
          sinon.assert.alwaysCalledWithExactly(handle, readyState(id));
          expect(editorView.state.doc).to.deep.equal(doc(
            p(`${hrefOld} ${href} `),
            mediaGroup(
              media({ id: testLinkId, type: 'link', collection: testCollectionName }),
              media({ id, type: 'link', collection: testCollectionName }),
            )
          ));
          editorView.destroy();
        });

        context('latest pos in range is out of doc range', () => {
          it('creates a link card to join the existing media group below', async () => {
            const hrefOld = 'www.google.com';
            const href = 'www.baidu.com';
            const { editorView } = editor(doc(
              p(`${hrefOld} ${href} {<>}`),
              mediaGroup(media({ id: testLinkId, type: 'link', collection: testCollectionName })),
            ));
            const handle = sinon.spy();

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
            sinon.assert.alwaysCalledWithExactly(handle, readyState(id));
            expect(editorView.state.doc).to.deep.equal(doc(
              p(`${hrefOld} ${href} `),
              mediaGroup(
                media({ id: testLinkId, type: 'link', collection: testCollectionName }),
                media({ id, type: 'link', collection: testCollectionName }),
              )
            ));
            editorView.destroy();
          });
        });
      });
    });

    context('when there are multiple links in link ranges', () => {
      it('creates link cards below the range where link was detected', async () => {
        const href1 = 'www.google.com';
        const href2 = 'www.baidu.com';
        const href3 = 'www.atlassian.com';
        const { editorView } = editor(doc(
          p(`{<>}${href1}`),
          p(`${href2} ${href3}`),
          p('hello')
        ));
        const handle = sinon.spy();

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
        sinon.assert.calledThrice(handle);
        sinon.assert.calledWithExactly(handle.firstCall as any, readyState(tempId1));
        sinon.assert.calledWithExactly(handle.secondCall as any, readyState(tempId2));
        sinon.assert.calledWithExactly(handle.thirdCall as any, readyState(tempId3));
        expect(editorView.state.doc).to.deep.equal(doc(
          p(`${href1}`),
          mediaGroup(
            media({ id: tempId1, type: 'link', collection: testCollectionName }),
          ),
          p(`${href2} ${href3}`),
          mediaGroup(
            media({ id: tempId2, type: 'link', collection: testCollectionName }),
            media({ id: tempId3, type: 'link', collection: testCollectionName }),
          ),
          p('hello'),
        ));
        editorView.destroy();
      });
    });

    it('should call remove callback for invalid or private links', async () => {
      const href = 'http://localhost';
      const { editorView } = editor(doc(p(`${href} {<>}`)));
      const handle = sinon.spy();

      const id = createTempId(href);
      const addLinkItemStub = sinon.stub(linkCreateContextMock, 'addLinkItem').returns(Promise.reject('error message'));
      await insertLinks(
        editorView,
        mediaStateManager,
        handle,
        [{ href, pos: 1 }],
        linkCreateContextMock,
        testCollectionName
      );
      addLinkItemStub.restore();

      sinon.assert.alwaysCalledWithExactly(handle, {
        id,
        error: 'error message',
        status: 'error',
      });
      expect(editorView.state.doc).to.deep.equal(doc(
        p(`${href} `),
        mediaGroup(media({ id, type: 'link', collection: testCollectionName })),
        p(),
      ));
      editorView.destroy();
    });
  });

  context('when selection is in a task or decision block', () => {
    it('link insertion ignored for task item', async () => {
      const itemDoc = doc(taskList(taskItem('{<>}')));
      const { editorView } = editor(itemDoc);
      const handle = sinon.spy();

      await insertLinks(
        editorView,
        mediaStateManager,
        handle,
        [],
        linkCreateContextMock,
        testCollectionName,
      );

      sinon.assert.notCalled(handle);
      expect(editorView.state.doc).to.deep.equal(itemDoc);
      editorView.destroy();
    });

    it('link insertion ignored for decision item', async () => {
      const decisionDoc = doc(decisionList(decisionItem('{<>}')));
      const { editorView } = editor(decisionDoc);
      const handle = sinon.spy();

      await insertLinks(
        editorView,
        mediaStateManager,
        handle,
        [],
        linkCreateContextMock,
        testCollectionName,
      );

      sinon.assert.notCalled(handle);
      expect(editorView.state.doc).to.deep.equal(decisionDoc);
      editorView.destroy();
    });
  });
});
