import { NodeView } from 'prosemirror-view';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import Slider from '../ui/Slider';

export function sliderNodeViewFactory(portalProviderAPI: PortalProviderAPI) {
  return (node: any, view: any, getPos: () => number): NodeView =>
    new ReactNodeView(
      node,
      view,
      getPos,
      portalProviderAPI,
      undefined,
      Slider,
    ).init();
}
