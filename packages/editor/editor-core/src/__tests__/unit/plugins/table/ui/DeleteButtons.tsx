import * as React from 'react';
import DeleteColumnButton from '../../../../../plugins/table/ui/TableFloatingControls/ColumnControls/DeleteColumnButton';
import DeleteRowButton from '../../../../../plugins/table/ui/TableFloatingControls/RowControls/DeleteRowButton';
import AkButton from '@atlaskit/button';
import { mountWithIntlContext } from '@atlaskit/editor-test-helpers';

[DeleteColumnButton, DeleteRowButton].forEach(DeleteButton => {
  describe(DeleteButton.name, () => {
    describe('callbacks', () => {
      it('fires the onMouseEnter callback', () => {
        const onMouseEnter = jest.fn();
        const r = mountWithIntlContext(
          <DeleteButton onMouseEnter={onMouseEnter} />,
        );
        r.simulate('mouseenter');

        expect(onMouseEnter).toBeCalled();
      });

      it('fires the onMouseLeave callback', () => {
        const onMouseLeave = jest.fn();
        const r = mountWithIntlContext(
          <DeleteButton onMouseLeave={onMouseLeave} />,
        );
        r.simulate('mouseleave');

        expect(onMouseLeave).toBeCalled();
      });
    });

    describe('appearance', () => {
      it('changes the button appearance to danger on hover', () => {
        const r = mountWithIntlContext(<DeleteButton />);
        expect(
          r
            .find(AkButton)
            .first()
            .props(),
        ).not.toHaveProperty('appearance', 'danger');

        r.simulate('mouseenter');
        expect(
          r
            .find(AkButton)
            .first()
            .props(),
        ).toHaveProperty('appearance', 'danger');

        r.simulate('mouseleave');
        expect(
          r
            .find(AkButton)
            .first()
            .props(),
        ).not.toHaveProperty('appearance', 'danger');
      });
    });
  });
});
