import { cognitoClient } from "../../axios/sms-clients/cognito-client";
import { toast } from "react-toastify";
import { userClient } from "../../axios/sms-clients/user-client";
import { IUser } from "../../model/user.model";

export const manageUsersTypes = {
    GET_USERS: 'MANAGE_GET_USERS',
}

export const manageGetUsersByGroup = (groupName: string) => async (dispatch: any) => {
    try {
        const response = await cognitoClient.findUsersByGroup(groupName)
        // get User Names
        const emailList: string[] = response.data.Users.map((user: any) =>
            (user.Attributes.find((attr: any) => attr.Name === 'email').Value));
        const resp = await userClient.findAllByEmails(emailList);

        const userList: IUser[] = resp.data.map((user: any) => <IUser>user)

        dispatch({
            payload: {
                manageUsers: userList.map((user: IUser) => ({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                })),
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

