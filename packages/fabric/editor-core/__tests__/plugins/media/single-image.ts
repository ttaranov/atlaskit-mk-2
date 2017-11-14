import { textAlign, float, clear } from '../../../src/plugins/media/single-image';

describe('single-image', () => {
  describe('textAlign', () => {
    describe('when node alignment property is left', () => {
      const alignment = 'left';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).toBe('left');
        });
      });

      describe('and display property is block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).toBe('left');
        });
      });
    });

    describe('when node alignment property is right', () => {
      const alignment = 'right';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns right', () => {
          const result = textAlign(alignment, display);

          expect(result).toBe('right');
        });
      });

      describe('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).toBe('left');
        });
      });
    });

    describe('when node alignment property is center', () => {
      const alignment = 'center';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns center', () => {
          const result = textAlign(alignment, display);

          expect(result).toBe('center');
        });
      });

      describe('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).toBe('left');
        });
      });
    });
  });

  describe('float', () => {
    describe('when node alignment property is left', () => {
      const alignment = 'left';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns none', () => {
          const result = float(alignment, display);

          expect(result).toBe('none');
        });
      });

      describe('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = float(alignment, display);

          expect(result).toBe('left');
        });
      });
    });

    describe('when node alignment property is right', () => {
      const alignment = 'right';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns none', () => {
          const result = float(alignment, display);

          expect(result).toBe('none');
        });
      });

      describe('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns right', () => {
          const result = float(alignment, display);

          expect(result).toBe('right');
        });
      });
    });

    describe('when node alignment property is center', () => {
      const alignment = 'center';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns none', () => {
          const result = float(alignment, display);

          expect(result).toBe('none');
        });
      });

      describe('and display property is block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = float(alignment, display);

          expect(result).toBe('left');
        });
      });
    });
  });

  describe('clear', () => {
    describe('when node alignment property is left', () => {
      const alignment = 'left';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).toBe('both');
        });
      });

      describe('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = clear(alignment, display);

          expect(result).toBe('left');
        });
      });
    });

    describe('when node alignment property is right', () => {
      const alignment = 'right';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).toBe('both');
        });
      });

      describe('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns right', () => {
          const result = clear(alignment, display);

          expect(result).toBe('right');
        });
      });
    });

    describe('when node alignment property is center', () => {
      const alignment = 'center';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).toBe('both');
        });
      });

      describe('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).toBe('both');
        });
      });
    });
  });
});
