import { userTypes } from '../actions/user/user.actions';
import { IUserState } from '.';

const FAKE_USER = { "city":       "Arlington",
                    "email":      "a@mail.com",
                    "firstname":  "Blake",
                    "lastname":   "Kruppa",
                    "mobile":     "714-123-1234",
                    "role" :      "manager",
                    "state":      "California", 
                    "timezone":   "+2", 
                    "userId":     1,
                    "zip":        "76013"}

const initialState: IUserState = {
  cogUser: null,
  isFirstSignin: false,
  login: true,
  user:  FAKE_USER
}

export const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case userTypes.REGISTER:
      return {
        ...state,
      }
    case userTypes.LOGIN:
      return {
        ...state,
        login:  action.payload.login,
        user:   action.payload.user
      }
    case userTypes.LOGOUT:
      return {
        ...state,
        login: false,
        user:  null
      }
    case userTypes.COGNITO_SIGN_IN:
      return {
        ...state,
        cogUser: action.payload.cogUser
      }
    case userTypes.FIRST_SIGN_IN:
      return {
        ...state,
        isFirstSignin: true
      }
  }
  return state;
}