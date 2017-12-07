let values;

export const __mock__ = v => {
  values = v;
};

export default ({ children }) => children(values);
