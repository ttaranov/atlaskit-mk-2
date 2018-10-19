import { ReactNodeView } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import {
  ReactComponentProps,
  getPosHandler,
} from '../../../nodeviews/ReactNodeView';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

export class CardNodeView extends ReactNodeView {
  update(node, decorations) {
    return super.update(node, decorations, () => false);
  }

  static fromComponent(
    component: React.ComponentType<any>,
    portalProviderAPI: PortalProviderAPI,
    props?: ReactComponentProps,
  ) {
    return (node: Node, view: EditorView, getPos: getPosHandler) =>
      new CardNodeView(
        node,
        view,
        getPos,
        portalProviderAPI,
        props,
        component,
      ).init();
  }
}
