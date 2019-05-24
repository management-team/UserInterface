import { cognitoClient } from "../../axios/sms-clients/cognito-client";
import { toast } from "react-toastify";
import { ICognitoUser } from "../../model/cognito-user.model";

export const manageUsersTypes = {
  GET_USERS: 'MANAGE_GET_USERS',
}

export const manageGetUsersByGroup = (groupName: string) => async (dispatch: any) => {
  try {
    const adminResponse = await cognitoClient.findUsersByGroup('admin');
    const stagingManagerResponse = await cognitoClient.findUsersByGroup('staging-manager');
    const trainerResponse = await cognitoClient.findUsersByGroup('trainer');

    adminResponse.data.Users.forEach((user: any) => { user.roles = [] });
    stagingManagerResponse.data.Users.forEach((user: any) => { user.roles = [] });
    trainerResponse.data.Users.forEach((user: any) => (user.roles = []));

    const admins: ICognitoUser[]= adminResponse.data.Users.map((user: any) => ({
      email: user.Attributes.find((attr: any) => attr.Name === 'email').Value,
      roles: user.roles.concat('Admin')
    }));
    
    const staging:ICognitoUser[]=stagingManagerResponse.data.Users.map((user: any) => ({
      email: user.Attributes.find((attr: any) => attr.Name === 'email').Value,
      roles: user.roles.concat('Staging Manager')
    }))
   
   const trainer:ICognitoUser[]=trainerResponse.data.Users.map((user: any) => ({
      email: user.Attributes.find((attr: any) => attr.Name === 'email').Value,
      roles: user.roles.concat('Trainer')
    }))

    let response = admins.concat(staging).concat(trainer);
    let merge = (a,b) => {
      for (let email in b){
        if(b.hasOwnProperty(email))
        a[email] = b[email]
        a.role = a.role.concat(b.role)
      }
      return a;
    }
    
    console.log("This is the finished list: " + merge(admins, staging));
    dispatch({
      payload: {
        manageUsers: response
      },
      type: manageUsersTypes.GET_USERS
    })
  } catch (e) {
    toast.warn('Unable to retreive users')
    dispatch({
      payload: {
      },
      type: ''
    })
  }
}

