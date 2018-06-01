export type Command =
  | {
      type: 'init';
    }
  | {
      type: 'reload';
      url: string;
      provider?: string;
    };
