import { Slice, Fragment } from 'prosemirror-model';
import { transformSliceToAddTableHeaders } from '../../../../plugins/table/actions';
import { defaultSchema } from '@atlaskit/editor-common';
import { table, p, tr, td, th } from '@atlaskit/editor-test-helpers';
import { panelNote } from '../../../../../../editor-test-helpers/src/schema-builder';

describe('table plugin', () => {
  describe('transformSliceToAddTableHeaders', () => {
    const textNode = defaultSchema.text('hello', undefined);
    const paragraphNode = defaultSchema.nodes.paragraph.createChecked(
      undefined,
      defaultSchema.text('within paragraph', [
        defaultSchema.marks.strong.create(),
      ]),
      undefined,
    );
    const ruleNode = defaultSchema.nodes.rule.createChecked();

    const tableBody = tr(
      td({ colwidth: [300] })(p('r4')),
      td()(p('r5')),
      td()(panelNote(p('r6'))),
    );

    it('handles an empty fragment', () => {
      const slice = new Slice(Fragment.from(undefined), 0, 0);
      expect(
        transformSliceToAddTableHeaders(slice, defaultSchema).eq(slice),
      ).toBe(true);
    });

    it('does nothing to a text fragment', () => {
      const slice = new Slice(Fragment.from(textNode), 0, 0);
      expect(
        transformSliceToAddTableHeaders(slice, defaultSchema).eq(slice),
      ).toBe(true);
    });

    it('does nothing to fragment with multiple non-table nodes', () => {
      const slice = new Slice(
        Fragment.from([textNode, ruleNode, paragraphNode]),
        1,
        0,
      );

      expect(
        transformSliceToAddTableHeaders(slice, defaultSchema).eq(slice),
      ).toBe(true);
    });

    it('transforms only the table within the slice', () => {
      const preTable = table({ isNumberColumnEnabled: true })(
        tr(
          td()(p('r1')),
          th({ colspan: 2 })(p('r2')),
          td()(panelNote(p('r3'))),
        ),

        tableBody,
      );

      const postTable = table({ isNumberColumnEnabled: true })(
        tr(
          th()(p('r1')),
          th({ colspan: 2 })(p('r2')),
          th()(panelNote(p('r3'))),
        ),

        tableBody,
      );

      const preSlice = new Slice(
        Fragment.from([textNode, preTable(defaultSchema), paragraphNode]),
        1,
        0,
      );

      const postSlice = new Slice(
        Fragment.from([textNode, postTable(defaultSchema), paragraphNode]),
        1,
        0,
      );

      expect(
        transformSliceToAddTableHeaders(preSlice, defaultSchema).eq(postSlice),
      ).toBe(true);
    });

    it('transforms any table within the slice', () => {
      const preTableA = table({ isNumberColumnEnabled: true })(
        tr(
          td()(p('r1')),
          th({ colspan: 2 })(p('r2')),
          td()(panelNote(p('r3'))),
        ),

        tableBody,
      );

      const postTableA = table({ isNumberColumnEnabled: true })(
        tr(
          th()(p('r1')),
          th({ colspan: 2 })(p('r2')),
          th()(panelNote(p('r3'))),
        ),

        tableBody,
      );

      const preTableB = table({ isNumberColumnEnabled: true })(
        tr(td()(p('b1')), th()(p('b2')), th()(p('b3'))),

        tableBody,
      );

      const postTableB = table({ isNumberColumnEnabled: true })(
        tr(th()(p('b1')), th()(p('b2')), th()(p('b3'))),

        tableBody,
      );

      const preSlice = new Slice(
        Fragment.from([
          textNode,
          preTableA(defaultSchema),
          paragraphNode,
          preTableB(defaultSchema),
        ]),
        1,
        0,
      );

      const postSlice = new Slice(
        Fragment.from([
          textNode,
          postTableA(defaultSchema),
          paragraphNode,
          postTableB(defaultSchema),
        ]),
        1,
        0,
      );

      expect(
        transformSliceToAddTableHeaders(preSlice, defaultSchema).eq(postSlice),
      ).toBe(true);
    });
  });
});
