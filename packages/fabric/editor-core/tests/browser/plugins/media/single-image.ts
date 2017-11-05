import { expect } from 'chai';
import { textAlign, float, clear } from '../../../../src/plugins/media/single-image';

describe('single-image', () => {
  describe('textAlign', () => {
    context('when node alignment property is left', () => {
      const alignment = 'left';

      context('and display property is block', () => {
        const display = 'block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).to.equal('left');
        });
      });

      context('and display property is block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).to.equal('left');
        });
      });
    });

    context('when node alignment property is right', () => {
      const alignment = 'right';

      context('and display property is block', () => {
        const display = 'block';

        it('returns right', () => {
          const result = textAlign(alignment, display);

          expect(result).to.equal('right');
        });
      });

      context('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).to.equal('left');
        });
      });
    });

    context('when node alignment property is center', () => {
      const alignment = 'center';

      context('and display property is block', () => {
        const display = 'block';

        it('returns center', () => {
          const result = textAlign(alignment, display);

          expect(result).to.equal('center');
        });
      });

      context('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).to.equal('left');
        });
      });
    });
  });

  describe('float', () => {
    context('when node alignment property is left', () => {
      const alignment = 'left';

      context('and display property is block', () => {
        const display = 'block';

        it('returns none', () => {
          const result = float(alignment, display);

          expect(result).to.equal('none');
        });
      });

      context('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = float(alignment, display);

          expect(result).to.equal('left');
        });
      });
    });

    context('when node alignment property is right', () => {
      const alignment = 'right';

      context('and display property is block', () => {
        const display = 'block';

        it('returns none', () => {
          const result = float(alignment, display);

          expect(result).to.equal('none');
        });
      });

      context('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns right', () => {
          const result = float(alignment, display);

          expect(result).to.equal('right');
        });
      });
    });

    context('when node alignment property is center', () => {
      const alignment = 'center';

      context('and display property is block', () => {
        const display = 'block';

        it('returns none', () => {
          const result = float(alignment, display);

          expect(result).to.equal('none');
        });
      });

      context('and display property is block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = float(alignment, display);

          expect(result).to.equal('left');
        });
      });
    });
  });

  describe('clear', () => {
    context('when node alignment property is left', () => {
      const alignment = 'left';

      context('and display property is block', () => {
        const display = 'block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).to.equal('both');
        });
      });

      context('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = clear(alignment, display);

          expect(result).to.equal('left');
        });
      });
    });

    context('when node alignment property is right', () => {
      const alignment = 'right';

      context('and display property is block', () => {
        const display = 'block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).to.equal('both');
        });
      });

      context('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns right', () => {
          const result = clear(alignment, display);

          expect(result).to.equal('right');
        });
      });
    });

    context('when node alignment property is center', () => {
      const alignment = 'center';

      context('and display property is block', () => {
        const display = 'block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).to.equal('both');
        });
      });

      context('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).to.equal('both');
        });
      });
    });
  });
});
