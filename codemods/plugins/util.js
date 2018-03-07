
/**
 * This file contains a Jscodeshift Util plugin that adds some helper methods to the jscodeshift
 * collection object.
 */
export default j => {
  // Finds the preceding import that importNode should be inserted after
  function findFollowingImport(root, importNode) {
    // Determines if the import source 'a' should precede 'b' in the import order
    // Places '@...' absolute imports after other absolute imports and relative imports
    // after absolute imports
    function precedes(a, b) {
      if ((a[0] === '.' || a[0] === '@') && b[0] !== '.') {
        return false;
      } else if (a[0] !== '.' && (b[0] === '.' || b[0] === '@')) {
        return true;
      } else {
        return a < b;
      }
    }
    let targetName;
    let targetPath;
    const importSource = importNode.source.value;
    
    root
      .find(j.ImportDeclaration)
      .forEach(path => {
        const name = path.node.source.value;
        if (!targetName && !precedes(name, importSource)) {
          targetName = name;
          targetPath = path;
        }
      });
    return targetPath;
  }

  const findFirst = function (type, filter) {
    const found = this.find(type, filter);

    return found.at(0);
  };

  const findLast = function(type, filter) {
    const found = this.find(type, filter);

    return found.at(found.length - 1);
  };

  const getFirstNode = function() {
    return this.find(j.Program).get('body', 0).node;
  }

  // Add an import to the end of the last import declaration
  // Note: Must have an existing import declaration in the file for this to work
  const addImport = function(node) {
    const importSpecifiers = node.specifiers.filter(s => j.ImportSpecifier.check(s));
    const defaultSpecifiers = node.specifiers.filter(s => j.ImportDefaultSpecifier.check(s));
    const source = node.source;
    const existingSource = this.find(j.ImportDeclaration, (node) => node.source.value === source.value);

    if (existingSource.size() > 0) {
      // Add missing named imports
      const existingNode = existingSource.get();
      const missingImportSpecifiers = importSpecifiers.filter(importSpecifier =>
        existingSource.find(j.ImportSpecifier, (existingSpecifier) =>
          existingSpecifier.local.name === importSpecifier.local.name
        ).size() === 0
      );
      existingNode.node.specifiers = existingNode.node.specifiers.concat(missingImportSpecifiers);
      if (defaultSpecifiers.length > 0) {
        // Add or replace default import
        const existingDefaultSpecifier = existingSource.find(j.ImportDefaultSpecifier);
        if (existingDefaultSpecifier.size() > 0) {
          existingDefaultSpecifier.get().replace(defaultSpecifiers[0]);
        } else {
          existingNode.node.specifiers.unshift(defaultSpecifiers[0]);
        }
      }
    } else {
      const followingImport = findFollowingImport(this, node);

      if (followingImport) {
        followingImport.insertBefore(node);
      } else {
        this.findLast(j.ImportDeclaration).insertAfter(node);
      }
    }
    
    return this;
  }

  const addTest = function(testNode) {
    const block = this.findFirst(j.ArrowFunctionExpression)
      .findFirst(j.BlockStatement);
    
    if (block.size() > 0) {
      block.getOrAdd(testNode, context => {
        return context.find(j.ExpressionStatement, (node) =>
          node.expression.callee.name === 'it' && node.expression.arguments[0].value === testNode.expression.arguments[0].value
        );
      }, false, (node) => block.get().node.body.push(node));
    }
    
    return this;
  }

  const addToProgram = function(node, idempCondition) {
    if (!idempCondition || idempCondition(this)) {
      const program = this.find(j.Program);
      if (program.size() === 0) {
        console.error('Could not find program node');
      }

      program.get().node.body.push(node);
    }
    
    return this;
  }

  // jscodeshift.template.statement is buggy when using nested template literals
  // so lets make our own here
  // Can be used like so: <Jscodeshift Collection>.code('my code here')
  // Calling jscodeshift on an empty string is one way to get a jscodeshift
  // collection if you don't already have one, e.g. j(''). Unfortunately it is
  // not exposed via the jscodeshift API directly.
  const code = function(codeString) {
    return j(codeString).find(j.Program).get().node.body[0];
  }

  const getOrAdd = function(node, getExisting, useExisting = true, addFn) {
    const existing = getExisting(this);

    if (existing.size() > 0) {
      return useExisting ? existing : existing.replaceWith(node);
    } else {
      if (addFn) {
        addFn(node)
      } else {
        this.addToProgram(node);
      }
    }

    return this.find(node.type, node);
  }

  j.registerMethods({
    findFirst,
    findLast,
    addImport,
    addTest,
    addToProgram,
    code,
    getOrAdd,
    getFirstNode,
  });
};
