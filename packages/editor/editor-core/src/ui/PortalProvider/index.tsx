import * as React from 'react';
import { createPortal } from 'react-dom';
import { EventDispatcher } from '../../event-dispatcher';

export type PortalProviderProps = {
  render: (portalProviderAPI: PortalProviderAPI) => React.ReactChild | null;
};

export type PortalRendererState = {
  portals: Map<HTMLElement, React.ReactChild>;
};

export class PortalProviderAPI extends EventDispatcher {
  portals = new Map();

  render(children: React.ReactChild, container: HTMLElement) {
    this.portals.set(container, children);
    this.emit('update', this.portals);
  }

  remove(container: HTMLElement) {
    this.portals.delete(container);
    this.emit('update', this.portals);
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
