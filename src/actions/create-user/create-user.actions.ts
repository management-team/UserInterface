import { IAddress } from "../../model/address.model";
import { IUser } from "../../model/user.model";
import { userClient } from "../../axios/sms-clients/user-client";
import { toast } from "react-toastify";
import { ICognitoUserAddGroup } from "../../model/cognito-user-add-group.model";
import { cognitoClient } from "../../axios/sms-clients/cognito-client";

export const createUserTypes = {
  TOGGLE: 'TOGGLE_CREATE_USER_MODAL',
  TOGGLE_LOCATION_DROPDOWN: 'TOGGLE_CREATE_USER_MODAL_LOCATION_DROPDOWN',
  TOGGLE_ROLE_DROPDOWN: 'TOGGLE_CREATE_USER_MODAL_ROLE_DROPDOWN',
  TOGGLE_COHORT_DROPDOWN: 'TOGGLE_CREATE_USER_MODAL_COHORT_DROPDOWN',
  UPDATE_NEW_USER: 'UPDATE_NEW_USER',
  UPDATE_NEW_USER_LOCATION: 'UPDATE_NEW_USER_LOCATION',
  UPDATE_NEW_USER_ROLE: 'UPDATE_NEW_USER_ROLE',
  UPDATE_NEW_USER_COHORT: 'UPDATE_NEW_USER_COHORT',
  USER_SAVED: 'CREATE_NEW_USER_USER_SAVED'
}

export const toggleModal = () => {
  return {
    payload: {
    },
    type: createUserTypes.TOGGLE
  }
}


export const toggleLocationDropdown = () => {
  return {
    payload: {},
    type: createUserTypes.TOGGLE_LOCATION_DROPDOWN
  }
}

export const toggleRoleDropdown = () => {
  return {
    payload: {},
    type: createUserTypes.TOGGLE_ROLE_DROPDOWN
  }
}

export const toggleCohortDropdown = () => {
  return {
    payload: {},
    type: createUserTypes.TOGGLE_COHORT_DROPDOWN
  }
}

export const updateNewUserLocation = (location: IAddress) => {
  return {
    payload: {
      location
    },
    type: createUserTypes.UPDATE_NEW_USER_LOCATION
  }
}

export const updateNewUserRole = (role: string, dropdownRole: string) => {
  return {
    payload: {
      role,
      dropdownRole
    },
    type: createUserTypes.UPDATE_NEW_USER_ROLE
  }
}

export const updateNewUserCohort = (cohort: string) => {
  return {
    payload: {
      cohort
    },
    type: createUserTypes.UPDATE_NEW_USER_COHORT
  }
}

export const updateNewUser = (newUser: IUser) => {
  return {
    payload: {
      newUser
    },
    type: createUserTypes.UPDATE_NEW_USER
  }
}


//Use async await tho?
export const saveUser = (newUser: IUser) => async (dispatch: (action: any) => void) => {
  await userClient.saveUser(newUser)
    .then(resp => {
      toast.success('User Created')
      dispatch({
        payload: {},
        type: createUserTypes.USER_SAVED
      });
      if (newUser.role !== 'associate') {
        let newCogUser: ICognitoUserAddGroup = {
          email: newUser.email,
          groupName: newUser.role
        };
        cognitoClient.addUserToGroup(newCogUser);
      }
    })
    .catch(e => {
      toast.error('Failed To Save User')
    })


}