import { ICreateUserState } from '.';
import { authTypes } from '../../actions/auth/auth.actions';
import { createUserTypes } from '../../actions/create-user/create-user.actions';

const initialState: ICreateUserState = {
  enabled: false,
  locationDropdownActive: false,
  roleDropdownActive: false,
  cohortDropdownActive: false,
  newUser: {
    userId: 0,
    userStatus: {
      statusId: 2,
      generalStatus: 'Training',
      specificStatus: 'Training',
      virtual: false
    },
    roles: [],
    trainingAddress: {
      addressId: 0,
      street: '',
      alias: '',
      city: '',
      country: '',
      state: '',
      zip: ''
    },
    role: '',
    dropdownRole: '',
    cohort: '',
    personalAddress: {
      addressId: 0,
      street: '',
      alias: '',
      city: '',
      country: '',
      state: '',
      zip: '',
    },
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  },
}

export const createUserReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case createUserTypes.TOGGLE:
      return {
        ...state,
        enabled: !state.enabled
      }
    case createUserTypes.TOGGLE_LOCATION_DROPDOWN:
      return {
        ...state,
        locationDropdownActive: !state.locationDropdownActive
      }
    case createUserTypes.TOGGLE_ROLE_DROPDOWN:
      return {
        ...state,
        roleDropdownActive: !state.roleDropdownActive
      }
    case createUserTypes.TOGGLE_COHORT_DROPDOWN:
      return {
        ...state,
        cohortDropdownActive: !state.cohortDropdownActive
      }
    case createUserTypes.UPDATE_NEW_USER_LOCATION:
      return {
        ...state,
        newUser: {
          ...state.newUser,
          trainingAddress: action.payload.location
        }
      }
    case createUserTypes.UPDATE_NEW_USER_ROLE:
      return {
        ...state,
        newUser: {
          ...state.newUser,
          role: action.payload.role,
          dropdownRole: action.payload.dropdownRole
        }
      }
    case createUserTypes.UPDATE_NEW_USER_COHORT:
      return {
        ...state,
        newUser: {
          ...state.newUser,
          cohort: action.payload.cohort
        }
      }
    case createUserTypes.UPDATE_NEW_USER:
      return {
        ...state,
        newUser: action.payload.newUser
      }
    case createUserTypes.USER_SAVED:
      return initialState;
    case authTypes.LOGOUT:
      return initialState;
  }
  return state;
}
