import { createEditor, chaiPlugin } from '@atlaskit/editor-test-helpers';
import { ConfluenceTransformer } from '../../src';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { browser } from '@atlaskit/editor-common';

chai.use(chaiPlugin);

// TODO: Flakey unskip in: https://product-fabric.atlassian.net/browse/ED-4579
describe.skip('confluence tables transform', () => {
  const onAllBrowsersExceptiOSIt = !browser.ios ? it : it.skip;

  // skip iOS since the viewport size is different, so tables will map to a different size
  onAllBrowsersExceptiOSIt(
    'maps the table to auto widths if we have a dynamic table',
    () => {
      const onChange = sinon.spy();
      const editor = createEditor({
        editorProps: {
          appearance: 'full-page',
          allowTables: {
            allowColumnResizing: true,
            allowMergeCells: true,
            allowBackgroundColor: true,
            allowNumberColumn: true,
          },
          allowUnsupportedContent: true,
          onChange,
          contentTransformerProvider: schema =>
            new ConfluenceTransformer(schema),
          defaultValue: `<p>hello</p>
        <table>
          <colgroup> <col /><col /></colgroup>
            <tr>
              <td>a dsfsdf sdfs dfsdf sdf sdf sdf sdf sdsdfsdfsd fsd sdf sdf s</td>
              <td>b</td>
              <td>sdfsd</td>
            </tr>
            <tr>
              <td>short</td>
              <td colspan='2'>hey this is aalsos asdasdasd asd asd asd</td>
            </tr>
          </table>`,
        },
      });

      const { editorView } = editor;

      expect(editorView.state.doc.childCount).to.equal(2);
      expect(editorView.state.doc.child(0).type.name).to.equal('paragraph');
      expect(editorView.state.doc.child(1).type.name).to.equal('table');

      const table = editorView.state.doc.child(1);

      expect(table.attrs.__autoSize).to.equal(false);

      // browsers might generate slightly different column widths, so we
      // test a range rather than a fixed value (which unfortunately means
      // we can't use .deep.equal)

      // first row, first col
      expect(table.child(0).child(0).attrs.colwidth.length).to.equal(1);
      expect(table.child(0).child(0).attrs.colwidth[0]).to.gte(363);
      expect(table.child(0).child(0).attrs.colwidth[0]).to.lte(364);

      // first row, second col
      expect(table.child(0).child(1).attrs.colwidth.length).to.equal(1);
      expect(table.child(0).child(1).attrs.colwidth[0]).to.gte(52);
      expect(table.child(0).child(1).attrs.colwidth[0]).to.lte(53);

      // first row, third col
      expect(table.child(0).child(2).attrs.colwidth.length).to.equal(1);
      expect(table.child(0).child(2).attrs.colwidth[0]).to.equal(0);

      // second row, first col
      expect(table.child(1).child(0).attrs.colwidth.length).to.equal(1);
      expect(table.child(1).child(0).attrs.colwidth[0]).to.gte(363);
      expect(table.child(1).child(0).attrs.colwidth[0]).to.lte(364);

      expect(table.child(1).child(1).attrs.colwidth.length).to.equal(2);
      expect(table.child(1).child(1).attrs.colspan).to.equal(2);
      expect(table.child(1).child(1).attrs.colwidth[0]).to.gte(52);
      expect(table.child(1).child(1).attrs.colwidth[0]).to.lte(53);
      expect(table.child(1).child(1).attrs.colwidth[1]).to.equal(0);

      // expect(editorView.state.doc).to.deep.equal(
      //   doc(
      //     p('hello'),
      //     table({ __autoSize: false })(
      //       tr(
      //         td({ colwidth: [364] })(
      //           p('a dsfsdf sdfs dfsdf sdf sdf sdf sdf sdsdfsdfsd fsd sdf sdf s'),
      //         ),
      //         td({ colwidth: [52] })(p('b')),
      //         td({ colwidth: [0] })(p('sdfsd')),
      //       ),
      //       tr(
      //         td({ colwidth: [364] })(p('short')),
      //         td({ colwidth: [52, 0], colspan: 2 })(
      //           p('hey this is aalsos asdasdasd asd asd asd'),
      //         ),
      //       ),
      //     ),
      //   ),
      // );

      expect(onChange.calledOnce).to.equal(true);
    },
  );
});
