export default (window.performance &&
  window.performance.now.bind(window.performance)) ||
  Date.now;
