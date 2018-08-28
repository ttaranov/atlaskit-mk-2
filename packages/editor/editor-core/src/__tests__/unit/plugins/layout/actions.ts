import {
  layoutSection,
  layoutColumn,
  doc,
  p,
  createEditor,
} from '@atlaskit/editor-test-helpers';
import {
  setActiveLayoutType,
  deleteActiveLayoutNode,
} from '../../../../plugins/layout/actions';

const editor = doc =>
  createEditor({ doc, editorProps: { allowLayouts: true } });

describe('layout actions', () => {
  describe('#setActiveLayoutType', () => {
    it('should update layout type of active layoutSection', () => {
      const { editorView } = editor(
        doc(
          layoutSection({ layoutType: 'two_equal' })(
            layoutColumn(p('{<>}')),
            layoutColumn(p('')),
          ),
        ),
      );
      setActiveLayoutType('three_equal')(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          layoutSection({ layoutType: 'three_equal' })(
            layoutColumn(p('')),
            layoutColumn(p('')),
            layoutColumn(p('')),
          ),
        ),
      );
    });
    it('should do nothing if selection not in layout', () => {
      const { editorView } = editor(doc(p('')));
      expect(
        setActiveLayoutType('three_equal')(
          editorView.state,
          editorView.dispatch,
        ),
      ).toBe(false);
    });
  });
  describe('#deleteActiveLayout', () => {
    it('should deletes  active layoutSection', () => {
      const { editorView } = editor(
        doc(
          layoutSection({ layoutType: 'two_equal' })(
            layoutColumn(p('{<>}')),
            layoutColumn(p('')),
          ),
        ),
      );
      deleteActiveLayoutNode(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('')));
    });
    it('should do nothing if selection not in layout', () => {
      const { editorView } = editor(doc(p('')));
      expect(
        setActiveLayoutType('three_equal')(
          editorView.state,
          editorView.dispatch,
        ),
      ).toBe(false);
    });
  });
});
