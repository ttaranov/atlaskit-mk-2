import { ColumnWidths } from '../../../../plugins/table/utils/colwidth';

describe('colwidth parsing', () => {
  describe('ColumnWidths', () => {
    it('handles a single column', () => {
      const tw = new ColumnWidths();
      tw.visit(0, 100);

      expect(tw.dividedWidths).toEqual([100]);
    });

    it('handles multiple columns', () => {
      const tw = new ColumnWidths();
      tw.visit(0, 100);
      tw.visit(1, 50);

      expect(tw.dividedWidths).toEqual([100, 50]);
    });

    it('handles spanning columns', () => {
      const tw = new ColumnWidths();
      tw.visit(0, 100);
      tw.visit(1, 50, 2);

      expect(tw.dividedWidths).toEqual([100, 25, 25]);
    });

    it('handles single spanned column', () => {
      const tw = new ColumnWidths();
      tw.visit(0, 100, 2);

      expect(tw.columnInfo).toEqual([
        { width: 100, span: 2 },
        { width: 100, span: 2 },
      ]);
    });

    it('handles breaking up spanned columns', () => {
      const tw = new ColumnWidths();
      // first row
      tw.visit(0, 100, 2);

      // second row
      tw.visit(0, 50, 1);
      tw.visit(1, 50, 1);
    });

    // [ m    m    m ]
    // [ s ][ m    m ]
    it('breaks 3 merge into 1 single 2 merge', () => {
      const tw = new ColumnWidths();
      // first row
      tw.visit(0, 100, 3);

      // second row
      tw.visit(0, 50, 1);
      tw.visit(1, 50, 2);

      expect(tw.columnInfo).toEqual([
        { width: 50, span: 1 },
        { width: 50, span: 2 },
        { width: 50, span: 2 },
      ]);
      expect(tw.dividedWidths).toEqual([50, 25, 25]);

      expect(tw.width(0, 1)).toEqual([50]);
      expect(tw.width(1, 2)).toEqual([50, 50]);
    });

    it('autos last column', () => {
      const tw = new ColumnWidths();
      tw.visit(0, 50, 1);
      tw.visit(1, 50, 1);

      expect(tw.columnInfo).toEqual([
        { width: 50, span: 1 },
        { width: 50, span: 1 },
      ]);
      expect(tw.dividedWidths).toEqual([50, 50]);

      expect(tw.width(0, 1, true)).toEqual([50]);
      expect(tw.width(1, 1, true)).toEqual([0]);
    });

    it('autos last column with merge', () => {
      const tw = new ColumnWidths();
      // first row
      tw.visit(0, 100, 3);

      // second row
      tw.visit(0, 50, 1);
      tw.visit(1, 50, 2);

      expect(tw.columnInfo).toEqual([
        { width: 50, span: 1 },
        { width: 50, span: 2 },
        { width: 50, span: 2 },
      ]);
      expect(tw.dividedWidths).toEqual([50, 25, 25]);

      expect(tw.width(0, 1, true)).toEqual([50]);
      expect(tw.width(1, 2, true)).toEqual([50, 0]);
    });

    // [ m    m    m ]
    // [ m    m ][ s ]
    it('breaks 3 merge into 2 merge 1 single', () => {
      const tw = new ColumnWidths();
      // first row
      tw.visit(0, 100, 3);

      // second row
      tw.visit(0, 50, 2);
      tw.visit(2, 50, 1);

      expect(tw.columnInfo).toEqual([
        { width: 50, span: 2 },
        { width: 50, span: 2 },
        { width: 50, span: 1 },
      ]);
      expect(tw.dividedWidths).toEqual([25, 25, 50]);
    });

    // [ m    m    m ]
    // [ s ][ s ][ s ]
    it('breaks 3 merge into 3 single', () => {
      const tw = new ColumnWidths();
      // first row
      tw.visit(0, 100, 3);

      // second row
      tw.visit(0, 33, 1);
      tw.visit(1, 33, 1);
      tw.visit(2, 33, 1);

      expect(tw.columnInfo).toEqual([
        { width: 33, span: 1 },
        { width: 33, span: 1 },
        { width: 33, span: 1 },
      ]);
      expect(tw.dividedWidths).toEqual([33, 33, 33]);
    });

    // and
    // [ m    m    m ]
    // [ m    m    m ]
    it('keeps 3 merge', () => {
      const tw = new ColumnWidths();
      // first row
      tw.visit(0, 100, 3);

      // second row
      tw.visit(0, 100, 3);

      expect(tw.columnInfo).toEqual([
        { width: 100, span: 3 },
        { width: 100, span: 3 },
        { width: 100, span: 3 },
      ]);
      expect(tw.dividedWidths.map(Math.floor)).toEqual([33, 33, 33]);
    });

    // and
    // [ m    m    m    m ]
    // [ m    m ][ m    m ]
    it('breaks 4 merge into 2 2-way merge', () => {
      const tw = new ColumnWidths();
      // first row
      tw.visit(0, 100, 4);

      // second row
      tw.visit(0, 50, 2);
      tw.visit(2, 50, 2);

      expect(tw.columnInfo).toEqual([
        { width: 50, span: 2 },
        { width: 50, span: 2 },
        { width: 50, span: 2 },
        { width: 50, span: 2 },
      ]);
      expect(tw.dividedWidths).toEqual([25, 25, 25, 25]);
    });
  });
});
