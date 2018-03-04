export default j => {
  const findFirst = function (type) {
    const found = this.find(type);

    return found.at(0);
  };

  const findLast = function(type) {
    const found = this.find(type);

    return found.at(found.length - 1);
  };

  // Add an import to the end of the last import declaration
  // Note: Must have an existing import declaration in the file for this to work
  const addImport = function(node) {
    const specifiers = node.specifiers;
    const source = node.source;
    const existingSource = this.find(j.ImportDeclaration, (node) => node.source.value === source.value);

    if (existingSource.size() > 0) {
      const existingNode = existingSource.get();
      const missingSpecifiers = specifiers.filter(importSpecifier =>
        existingSource.find(j.ImportSpecifier, (existingSpecifier) =>
          existingSpecifier.local.name === importSpecifier.local.name
        ).size() === 0
      );
      existingNode.node.specifiers = existingNode.node.specifiers.concat(missingSpecifiers);

    } else {
      this.findLast(j.ImportDeclaration)
        .insertAfter(node);
    }
    
    return this;
  }

  const addTest = function(testNode) {
    const block = this.findFirst(j.ArrowFunctionExpression)
      .findFirst(j.BlockStatement);
    
    if (block.size() > 0) {
      console.log(block);
      block.get().node.body.push(testNode);
    }
    
    return this;
  }

  j.registerMethods({
    findFirst,
    findLast,
    addImport,
    addTest,
  });
};
