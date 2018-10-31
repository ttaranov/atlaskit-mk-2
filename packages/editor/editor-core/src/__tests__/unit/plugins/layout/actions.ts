import {
  layoutSection,
  layoutColumn,
  doc,
  p,
  createEditor,
} from '@atlaskit/editor-test-helpers';
import {
  deleteActiveLayoutNode,
  setPresetLayout,
} from '../../../../plugins/layout/actions';

const editor = doc =>
  createEditor({ doc, editorProps: { allowLayouts: true } });

describe('layout actions', () => {
  describe('#setActiveLayoutType', () => {
    it('should update layout type of active layoutSection', () => {
      const { editorView } = editor(
        doc(
          layoutSection(
            layoutColumn({ width: 50 })(p('{<>}')),
            layoutColumn({ width: 50 })(p('')),
          ),
        ),
      );
      setPresetLayout('three_equal')(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          layoutSection(
            layoutColumn({ width: 33.33 })(p('')),
            layoutColumn({ width: 33.33 })(p('')),
            layoutColumn({ width: 33.33 })(p('')),
          ),
        ),
      );
    });
    it('should do nothing if selection not in layout', () => {
      const { editorView } = editor(doc(p('')));
      expect(
        setPresetLayout('three_equal')(editorView.state, editorView.dispatch),
      ).toBe(false);
    });
  });
  describe('#deleteActiveLayout', () => {
    it('should deletes  active layoutSection', () => {
      const { editorView } = editor(
        doc(
          layoutSection(
            layoutColumn({ width: 50 })(p('{<>}')),
            layoutColumn({ width: 50 })(p('')),
          ),
        ),
      );
      deleteActiveLayoutNode(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('')));
    });
    it('should do nothing if selection not in layout', () => {
      const { editorView } = editor(doc(p('')));
      expect(
        setPresetLayout('three_equal')(editorView.state, editorView.dispatch),
      ).toBe(false);
    });
  });
});
