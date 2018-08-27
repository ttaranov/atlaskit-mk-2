import * as React from 'react';
import {
  createPortal,
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode,
} from 'react-dom';
import { EventDispatcher } from '../../event-dispatcher';

export type PortalProviderProps = {
  render: (portalProviderAPI: PortalProviderAPI) => React.ReactChild | null;
};

export type PortalRendererState = {
  portals: Map<HTMLElement, React.ReactChild>;
};

export class PortalProviderAPI extends EventDispatcher {
  portals = new Map();
  context: any;

  setContext = context => {
    this.context = context;
  };

  render(children: React.ReactChild, container: HTMLElement) {
    this.portals.set(container, children);
    unstable_renderSubtreeIntoContainer(this.context, children, container);
  }

  remove(container: HTMLElement) {
    this.portals.delete(container);
    unmountComponentAtNode(container);
  }
}

export class PortalProvider extends React.Component<PortalProviderProps> {
  portalProviderAPI: PortalProviderAPI;

  constructor(props) {
    super(props);
    this.portalProviderAPI = new PortalProviderAPI();
  }

  render() {
    return this.props.render(this.portalProviderAPI);
  }
}

export class PortalRenderer extends React.Component<
  { portalProviderAPI: PortalProviderAPI },
  PortalRendererState
> {
  constructor(props) {
    super(props);
    props.portalProviderAPI.setContext(this);
    props.portalProviderAPI.on('update', this.handleUpdate);
    this.state = { portals: new Map() };
  }

  handleUpdate = portals => this.setState({ portals });

  render() {
    const { portals } = this.state;
    return (
      <>
        {Array.from(portals.entries()).map(([container, children]) =>
          createPortal(children, container),
        )}
      </>
    );
  }
}
