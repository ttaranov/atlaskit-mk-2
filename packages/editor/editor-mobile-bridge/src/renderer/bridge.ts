export default interface RendererBridge {
  setContent(content: string);
  onPromiseResolved(uuid: string, paylaod: string);
  onPromiseRejected(uuid: string);
}
