export const mediaLocalePrefix = 'fabric.media';
export const prefixMessages = (messages: { [key: string]: string }): Object => {
  return Object.keys(messages).reduce((prev, current) => {
    const key = `${mediaLocalePrefix}.${current}`;

    return {
      ...prev,
      [key]: messages[current],
    };
  }, {});
};
