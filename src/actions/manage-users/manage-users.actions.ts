import { cognitoClient } from "../../axios/sms-clients/cognito-client";
import { toast } from "react-toastify";
import { ICognitoUser, cognitoRoles } from "../../model/cognito-user.model";
import { userClient } from "../../axios/sms-clients/user-client";

export const manageUsersTypes = {
    GET_USERS: 'MANAGE_GET_USERS',
}

export const manageGetUsersByGroup = (groupName: string, email: string, page?: number) => async (dispatch: any) => {
    console.log('groupName = ' + groupName)
    page || (page = 0);

    try {

        let adminResponsePromise;
        let stagingManagerResponsePromise;
        let trainerResponsePromise;

        if (groupName === cognitoRoles.ADMIN) {
            adminResponsePromise = cognitoClient.findUsersByGroup(cognitoRoles.ADMIN);
        }
        else if (groupName === cognitoRoles.STAGING_MANAGER) {
            stagingManagerResponsePromise = cognitoClient.findUsersByGroup(cognitoRoles.STAGING_MANAGER);
        }
        else if (groupName === cognitoRoles.TRAINER) {
            trainerResponsePromise = cognitoClient.findUsersByGroup(cognitoRoles.TRAINER);
        }
        else {
            adminResponsePromise = cognitoClient.findUsersByGroup(cognitoRoles.ADMIN);
            stagingManagerResponsePromise = cognitoClient.findUsersByGroup(cognitoRoles.STAGING_MANAGER);
            trainerResponsePromise = cognitoClient.findUsersByGroup(cognitoRoles.TRAINER);
        }


        let userInfoRespPromise;
        if (email) {
            userInfoRespPromise = userClient.findUsersByPartialEmail(email, page);
        } else {
            userInfoRespPromise = userClient.findAllUsers(page);
        }
        let userMap = new Map<string, ICognitoUser>();

        if (adminResponsePromise) {
            const adminResponse = await adminResponsePromise;
            addUserRolesToMap(cognitoRoles.ADMIN, adminResponse.data.Users, userMap);
        }
        if (stagingManagerResponsePromise) {
            const stagingManagerResponse = await stagingManagerResponsePromise;
            addUserRolesToMap(cognitoRoles.STAGING_MANAGER, stagingManagerResponse.data.Users, userMap);
        }
        if (stagingManagerResponsePromise) {
            const trainerResponse = await trainerResponsePromise;
            addUserRolesToMap(cognitoRoles.TRAINER, trainerResponse.data.Users, userMap);
        }


        //add user names
        let userInfoResp = await userInfoRespPromise;
        const userServiceUserList = userInfoResp.data.content;
        const pageTotal = userInfoResp.data.totalPages;


        let listOfUsers = new Array<ICognitoUser>();

        for (let i = 0; i < userServiceUserList.length; i++) {
            let potentialUser = userMap.get(userServiceUserList[i].email)
            let altenateUser = {
                firstName: userServiceUserList[i].firstName,
                lastName: userServiceUserList[i].lastName,
                email: userServiceUserList[i].email,
                roles: new Array<string>()
            };
            if (potentialUser) {
                altenateUser.roles = potentialUser.roles
            }

            listOfUsers.push(altenateUser);
        }

        dispatch({
            payload: {
                manageUsers: listOfUsers,
                manageUsersCurrentPage: page,
                manageUsersPageTotal: pageTotal
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

function addUserRolesToMap(role: string, users, userMap: Map<string, ICognitoUser>) {
    for (let i = 0; i < users.length; i++) {
        const currentCognitoUser = users[i];
        const currentEmail = currentCognitoUser.Attributes.find((attr: any) => attr.Name === 'email').Value;
        const mapUser = userMap.get(currentEmail)
        let newUser: ICognitoUser = mapUser ? mapUser : {
            email: currentEmail,
            roles: []
        };
        newUser.roles.push(role);
        userMap.set(newUser.email, newUser);
    }
}