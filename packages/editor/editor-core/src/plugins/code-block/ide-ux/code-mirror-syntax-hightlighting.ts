// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
import javascript from './javascript';

function splitLines(string) {
  return string.split(/\r?\n|\r/);
}

class StringStream {
  string: string;
  pos = 0;
  start = 0;
  lineStart = 0;

  constructor(string) {
    this.string = string;
  }

  eol() {
    return this.pos >= this.string.length;
  }
  sol() {
    return this.pos == 0;
  }
  peek() {
    return this.string.charAt(this.pos) || null;
  }
  next() {
    if (this.pos < this.string.length) return this.string.charAt(this.pos++);
  }
  eat(match: string | Function | RegExp) {
    let ch = this.string.charAt(this.pos);
    let ok;
    if (typeof match == 'string') {
      ok = ch == match;
    } else if (typeof match == 'function') {
      ok = ch && match(ch);
    } else {
      ok = ch && match.test(ch);
    }
    if (ok) {
      ++this.pos;
      return ch;
    }
  }
  eatWhile(match) {
    var start = this.pos;
    while (this.eat(match)) {}
    return this.pos > start;
  }
  eatSpace() {
    var start = this.pos;
    while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;
    return this.pos > start;
  }
  skipToEnd() {
    this.pos = this.string.length;
  }
  skipTo(ch: string) {
    var found = this.string.indexOf(ch, this.pos);
    if (found > -1) {
      this.pos = found;
      return true;
    }
  }
  backUp(n: number) {
    this.pos -= n;
  }
  column() {
    return this.start - this.lineStart;
  }
  indentation() {
    return 0;
  }
  match(pattern, consume, caseInsensitive) {
    if (typeof pattern == 'string') {
      const cased = function(str) {
        return caseInsensitive ? str.toLowerCase() : str;
      };
      const substr = this.string.substr(this.pos, pattern.length);
      if (cased(substr) == cased(pattern)) {
        if (consume !== false) {
          this.pos += pattern.length;
        }
        return true;
      }
    } else {
      const match = this.string.slice(this.pos).match(pattern);
      if (match && match.index && match.index > 0) {
        return null;
      }
      if (match && consume !== false) {
        this.pos += match[0].length;
      }
      return match;
    }
  }
  current() {
    return this.string.slice(this.start, this.pos);
  }
  hideFirstChars(n: number, inner: Function) {
    this.lineStart += n;
    try {
      return inner();
    } finally {
      this.lineStart -= n;
    }
  }
  lookAhead() {
    return null;
  }
}

class CodeMirror {
  modes = {};
  mimeModes = {};
  startState = function(mode, a1, a2) {
    return mode.startState ? mode.startState(a1, a2) : true;
  };
  defineMode = function(name, mode) {
    if (arguments.length > 2)
      mode.dependencies = Array.prototype.slice.call(arguments, 2);
    this.modes[name] = mode;
  };
  defineMIME = function(mime, spec) {
    this.mimeModes[mime] = spec;
  };
  resolveMode = function(spec) {
    if (typeof spec == 'string' && this.mimeModes.hasOwnProperty(spec)) {
      spec = this.mimeModes[spec];
    } else if (
      spec &&
      typeof spec.name == 'string' &&
      this.mimeModes.hasOwnProperty(spec.name)
    ) {
      spec = this.mimeModes[spec.name];
    }
    if (typeof spec == 'string') return { name: spec };
    else return spec || { name: 'null' };
  };
  getMode = function(options, spec) {
    spec = this.resolveMode(spec);
    var mfactory = this.modes[spec.name];
    if (!mfactory) throw new Error('Unknown mode: ' + spec);
    return mfactory(options, spec);
  };
  registerHelper = () => {};
  registerGlobalHelper = () => {};
  runMode = function(string, modespec, callback, options) {
    var mode = this.getMode({ indentUnit: 2 }, modespec);

    var lines = splitLines(string),
      state = (options && options.state) || this.startState(mode);
    for (var i = 0, e = lines.length; i < e; ++i) {
      if (i) callback('\n');
      var stream = new StringStream(lines[i]);
      if (!stream.string && mode.blankLine) mode.blankLine(state);
      while (!stream.eol()) {
        var style = mode.token(stream, state);
        callback('<text>', style, i, stream.start, stream.pos, state);
        stream.start = stream.pos;
      }
    }
  };
}

const parser = new CodeMirror();
parser.defineMode('null', function() {
  return {
    token: function(stream) {
      stream.skipToEnd();
    },
  };
});
parser.defineMIME('text/plain', 'null');

javascript(parser);

export default parser;
