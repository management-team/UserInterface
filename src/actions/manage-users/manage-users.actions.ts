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



    let userMap = new Map<string, ICognitoUser>();

    for (let i = 0; i < adminResponse.data.Users.length; i++) {
      const currentCognitoUser = adminResponse.data.Users[i];
      let newUser: ICognitoUser = {
        email: currentCognitoUser.Attributes.find((attr: any) => attr.Name === 'email').Value,
        roles: []
      };
      newUser.roles.push('admin');
      userMap.set(newUser.email, newUser);
    }
    for (let i = 0; i < stagingManagerResponse.data.Users.length; i++) {
      const currentCognitoUser = stagingManagerResponse.data.Users[i];
      const currentEmail = currentCognitoUser.Attributes.find((attr: any) => attr.Name === 'email').Value;
      const mapUser = userMap.get(currentEmail)
      let newUser: ICognitoUser = mapUser ? mapUser : {
        email: currentEmail,
        roles: []
      };

      newUser.roles.push('staging-manager');
      userMap.set(newUser.email, newUser);
    }
    for (let i = 0; i < trainerResponse.data.Users.length; i++) {
      const currentCognitoUser = trainerResponse.data.Users[i];
      const currentEmail = currentCognitoUser.Attributes.find((attr: any) => attr.Name === 'email').Value;
      const mapUser = userMap.get(currentEmail)
      let newUser: ICognitoUser = mapUser ? mapUser : {
        email: currentEmail,
        roles: []
      };

      newUser.roles.push('trainer');
      userMap.set(newUser.email, newUser);
    }
    const mapArray = Array.from(userMap);


    const userArray = mapArray.map(entry => entry[1]);

    dispatch({
      payload: {
        manageUsers: userArray
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

