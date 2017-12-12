let params = {
  image: undefined,
  loaded: false,
  errored: false,
};

/* set the mock parameters  */
export const __mock__ = p => {
  params = p;
};

/*
  mock `react-render-image` calling the the Function as a Child with the mock parameters
*/
export default ({ children }) => children(params);
