export const mediaLocalePrefix = 'fabric.media';
export const prefixMessages = (messages: {
  [key: string]: string;
}): { [key: string]: string } => {
  return Object.keys(messages).reduce((prev, current) => {
    const key = `${mediaLocalePrefix}.${current}`;

    return {
      ...prev,
      [key]: messages[current],
    };
  }, {});
};
