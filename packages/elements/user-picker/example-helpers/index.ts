import { userPickerData } from '@atlaskit/util-data-test';
import { User } from '../src/types';

export const exampleUsers = userPickerData as User[];

export const unassigned = { id: 'unassign', nickname: 'Unassigned' };
export const assignToMe = { id: 'assign-me', nickname: 'Assign to me' };
