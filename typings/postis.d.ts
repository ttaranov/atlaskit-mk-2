declare module 'postis' {
  export type PostisConfig = {
    window: Window;
    scope: string;
  };

  export type PostisChannelSendOptions = {
    method: string;
    params?: any;
  };

  export type PostisChannel = {
    listen: (method: string, callback: (message: any) => void) => void;
    send: (options: PostisChannelSendOptions) => void;
    ready: (callback: () => void) => void;
    destroy: (callback: () => void) => void;
  };

  export type Postis = (config: PostisConfig) => PostisChannel;

  export default Postis;
}
