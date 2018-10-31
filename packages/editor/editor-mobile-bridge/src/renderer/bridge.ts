export interface LinkBridge {
  onLinkClick(url: string);
}

export interface PromiseBridge {
  onPromiseResolved(uuid: string, paylaod: string);
  onPromiseRejected(uuid: string);
}

export default interface RendererBridge extends LinkBridge, PromiseBridge {
  setContent(content: string);
}
