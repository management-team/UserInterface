import { cognitoClient } from "../../axios/sms-clients/cognito-client";
import { toast } from "react-toastify";
import { ICognitoUser } from "../../model/cognito-user.model";
import { userClient } from "../../axios/sms-clients/user-client";
import { sortTypes } from "../../components/manage/manage-internal/manage-internal.component";

export const manageUsersTypes = {
    GET_USERS: 'MANAGE_GET_USERS',
    GET_USERS_SORTED: 'GET_USERS_SORTED'
}


export const manageGetUsersByGroup = (groupName: string) => async (dispatch: any) => {
  console.log('groupName = ' + groupName)

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
    //change map to array
    const mapArray = Array.from(userMap);
    let userArray = new Array<ICognitoUser>();
    userArray = mapArray.map(entry => entry[1]);

    //add user names
    const emailList: string[] = userArray.map(user => user.email )
    const userInfoResp = await userClient.findAllByEmails(emailList);
    
    for ( let i = 0; i < userInfoResp.data.length; i++){
      const respEmail = userInfoResp.data[i].email;
      for (let j = 0; j < userArray.length; j++){
        if(userArray[j].email === respEmail){
          userArray[j].firstName = userInfoResp.data[i].firstName;
          userArray[j].lastName = userInfoResp.data[i].lastName;
        }
      } 
    }
  
    //filter by the group name
    if (groupName !== 'all') {
      userArray = userArray.filter(user => user.roles.some(role => role.includes(groupName)))
    }

    console.log('this is the array: ' + userArray.map(user => user.roles))
    dispatch({
      payload: {
        manageUsers: userArray,
        currentRole: groupName
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


export const sortUsers = (userArray:ICognitoUser[], sortKey) => (dispatch: any) => {
  console.log(userArray)
  userArray = userArray.sort((a,b) => sortBy(a,b,sortKey));

  dispatch({
    payload:{
      manageUsers: userArray,
      userTableSort: sortKey
    },
    type: manageUsersTypes.GET_USERS_SORTED
  })
}

function sortBy(user1,user2,sortKey) {
  if (user1 === user2){
    return 0;
  }
  if (!user2) {
    return 1;
  }
  if (!user1) {
    return -1;
  }
  switch (sortKey){
    case sortTypes.FIRST_NAME:
    return sortByString(user1.firstName, user2.firstName)
    case sortTypes.LAST_NAME:
    return sortByString(user1.lastName, user2.lastName)
    case sortTypes.EMAIL:
    return sortByString(user1.email, user2.email)
    case sortTypes.FIRST_NAME_REVERSE:
    return sortByString(user1.firstName, user2.firstName) * (-1)
    case sortTypes.LAST_NAME_REVERSE:
    return sortByString(user1.lastName, user2.lastName) * (-1)
    case sortTypes.EMAIL_REVERSE:
    return sortByString(user1.email, user2.email) * (-1)
    default:
    return 0;
  }
  
}

function sortByString(a,b) {
  if (a === b){
    return 0;
  }
  if (!b) {
    return 1;
  }
  if (!a) {
    return -1;
  }
  if (a < b){
    return -1;
  }
  if (a > b){
    return 1;
  }
  return 0;
  
}
