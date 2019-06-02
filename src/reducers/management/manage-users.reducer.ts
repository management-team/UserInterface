import { IManageUsersState } from '.';
import { authTypes } from '../../actions/auth/auth.actions';
import { manageUsersTypes } from '../../actions/manage-users/manage-users.actions';

const initialState: IManageUsersState = {
  manageUsers: [],
  componentLoaded: false,
  currentRole: 'all',
  userTableSort: 'sorted'
}

export const manageUsersReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case manageUsersTypes.GET_USERS:
      return {
        ...state,
        manageUsers: action.payload.manageUsers,
        componentLoaded: true,
        currentRole: action.payload.currentRole
      }
      case manageUsersTypes.GET_USERS_SORTED:
      return {
        ...state,
        manageUsers: action.payload.manageUsers,
        componentLoaded: true,
        userTableSort: action.payload.userTableSort
      }
    case authTypes.LOGOUT:
      return initialState;
  }
  return state;
}
