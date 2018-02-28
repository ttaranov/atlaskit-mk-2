const findLast = function(type) {
  const found = this.find(type);

  return found.at(found.length - 1);
};

export default j => {
  j.registerMethods({
    findLast,
  });
};
