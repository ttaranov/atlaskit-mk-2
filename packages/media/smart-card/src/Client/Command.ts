export type Command =
  | {
      type: 'init';
    }
  | {
      type: 'reload';
      provider: string;
    };
