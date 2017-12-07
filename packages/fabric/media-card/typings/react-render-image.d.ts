declare module 'react-render-image' {
  export function __mock__(status: {
    image?: HTMLImageElement;
    loaded: boolean;
    errored: boolean;
  }): void;
}
