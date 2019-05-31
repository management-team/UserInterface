import { cognitoClient } from "../../axios/sms-clients/cognito-client";
import { toast } from "react-toastify";
import { ICognitoUser } from "../../model/cognito-user.model";
import { userClient } from "../../axios/sms-clients/user-client";

export const manageUsersTypes = {
  GET_USERS: 'MANAGE_GET_USERS',
}

export const manageGetUsersByGroup = (groupName: string, email: string) => async (dispatch: any) => {
  console.log('groupName = ' + groupName)

  try {
    const adminResponsePromise = cognitoClient.findUsersByGroup('admin');
    const stagingManagerResponsePromise = cognitoClient.findUsersByGroup('staging-manager');
    const trainerResponsePromise = cognitoClient.findUsersByGroup('trainer');
    let userInfoRespPromise;
    if (email) {
      userInfoRespPromise = userClient.findUsersByPartialEmail(email);
    } else {
      userInfoRespPromise = userClient.findAllUsers();
    }
    const adminResponse = await adminResponsePromise;
    const stagingManagerResponse = await stagingManagerResponsePromise;
    const trainerResponse = await trainerResponsePromise;
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

    //add user names
    

    let userInfoResp = await userInfoRespPromise;



    let listOfUsers = new Array<ICognitoUser>();

    for (let i = 0; i < userInfoResp.data.length; i++) {
      let potentialUser = userMap.get(userInfoResp.data[i].email)
      if (potentialUser) {
        let altenateUser = {
          firstName: userInfoResp.data[i].firstName,
          lastName: userInfoResp.data[i].lastName,
          email: userInfoResp.data[i].email,
          roles: potentialUser.roles
        };
        listOfUsers.push(altenateUser);
      } else {
        let altenateUser = {
          firstName: userInfoResp.data[i].firstName,
          lastName: userInfoResp.data[i].lastName,
          email: userInfoResp.data[i].email,
          roles: []
        };
        listOfUsers.push(altenateUser);
      }
    }
    console.log(listOfUsers);



    //filter by the group name
    // if (groupName !== 'all') {
    //   listOfUsers = listOfUsers.filter(user => user.roles.some(role => role.includes(groupName)))
    // }
    dispatch({
      payload: {
        manageUsers: listOfUsers
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

