import * as React from 'react';
import { createPortal } from 'react-dom';

export type PortalProviderAPI = {
  render: (children: React.ReactChild, container: HTMLElement) => void;
  destroy: (container: HTMLElement) => void;
};

export type PortalProviderProps = {
  render: (portalProviderAPI: PortalProviderAPI) => React.ReactChild | null;
};

export type PortalProviderState = {
  portals: Map<HTMLElement, React.ReactChild>;
};

export class PortalProvider extends React.Component<
  PortalProviderProps,
  PortalProviderState
> {
  state = { portals: new Map() };

  private portalProviderAPI: PortalProviderAPI = {
    render: (children, container) =>
      this.setState(state => ({
        portals: state.portals.set(container, children),
      })),
    destroy: container =>
      this.setState(state => {
        state.portals.delete(container);
        return { portals: state.portals };
      }),
  };

  render() {
    const { portals } = this.state;
    return (
      <>
        {this.props.render(this.portalProviderAPI)}
        {Array.from(portals.entries()).map(([container, children]) =>
          createPortal(children, container),
        )}
      </>
    );
  }
}
