import { NodeView } from 'prosemirror-view';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import Slider from '../ui/Slider';

export default class SliderView extends ReactNodeView implements NodeView {
  createDomRef() {
    const dom = document.createElement('span');
    dom.style.display = 'inline-block';
    dom.style.width = '100%';
    return dom;
  }

  ignoreMutation(record: MutationRecord) {
    return true;
  }
}

export function sliderNodeViewFactory(portalProviderAPI: PortalProviderAPI) {
  return (node: any, view: any, getPos: () => number): NodeView =>
    new SliderView(
      node,
      view,
      getPos,
      portalProviderAPI,
      undefined,
      Slider,
    ).init();
}
