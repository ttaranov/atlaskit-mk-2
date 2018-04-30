import { Plugin, TextSelection } from 'prosemirror-state';

export default new Plugin({
  props: {
    handleClick(view, clickPos, event) {
      const { code } = view.state.schema.marks;
      const $click = view.state.doc.resolve(clickPos);

      const clickWasAtEdgeOfATextNode =
        ($click.nodeBefore ? $click.nodeBefore.isInline : $click.nodeAfter) &&
        ($click.nodeAfter ? $click.nodeAfter.isInline : $click.nodeBefore) &&
        $click.textOffset === 0;

      const clickWasNearACodeMark =
        ($click.nodeBefore && code.isInSet($click.nodeBefore.marks)) ||
        ($click.nodeAfter && code.isInSet($click.nodeAfter.marks));

      if (clickWasAtEdgeOfATextNode && clickWasNearACodeMark) {
        // Replace manual DOM check with EditorView::posAtNode once it is released on DefinitelyTyped
        const clickWasInsideCodeMark =
          event.target &&
          event.target['pmViewDesc'] &&
          event.target['pmViewDesc'].mark &&
          event.target['pmViewDesc'].mark.type === code;

        const nodeNextToClick =
          $click.nodeBefore && code.isInSet($click.nodeBefore.marks)
            ? $click.nodeAfter
            : $click.nodeBefore;

        // Need to set the selection here to allow clicking between [code('text'),{<>},emoji()]
        if (clickWasInsideCodeMark) {
          view.dispatch(
            view.state.tr
              .setSelection(TextSelection.near($click))
              .setStoredMarks([code.create()]),
          );
          return true;
        } else {
          view.dispatch(
            view.state.tr
              .setSelection(TextSelection.near($click))
              .setStoredMarks(nodeNextToClick ? nodeNextToClick.marks : []),
          );
          return true;
        }
      }
      return false;
    },
  },
});
