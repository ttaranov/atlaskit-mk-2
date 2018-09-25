import * as React from 'react';
import Button from '@atlaskit/button';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';

import DeleteColumnButton from '../../../../../plugins/table/ui/TableFloatingControls/ColumnControls/DeleteColumnButton';
import DeleteRowButton from '../../../../../plugins/table/ui/TableFloatingControls/RowControls/DeleteRowButton';

[DeleteColumnButton, DeleteRowButton].forEach(DeleteButton => {
  describe(DeleteButton.name, () => {
    describe('callbacks', () => {
      it('fires the onMouseEnter callback', () => {
        const onMouseEnter = jest.fn();
        const r = mountWithIntl(<DeleteButton onMouseEnter={onMouseEnter} />);
        r.simulate('mouseenter');

        expect(onMouseEnter).toBeCalled();
      });

      it('fires the onMouseLeave callback', () => {
        const onMouseLeave = jest.fn();
        const r = mountWithIntl(<DeleteButton onMouseLeave={onMouseLeave} />);
        r.simulate('mouseleave');

        expect(onMouseLeave).toBeCalled();
      });
    });

    describe('appearance', () => {
      it('changes the button appearance to danger on hover', () => {
        const r = mountWithIntl(<DeleteButton />);
        expect(
          r
            .find(Button)
            .first()
            .props(),
        ).not.toHaveProperty('appearance', 'danger');

        r.simulate('mouseenter');
        expect(
          r
            .find(Button)
            .first()
            .props(),
        ).toHaveProperty('appearance', 'danger');

        r.simulate('mouseleave');
        expect(
          r
            .find(Button)
            .first()
            .props(),
        ).not.toHaveProperty('appearance', 'danger');
      });
    });
  });
});
